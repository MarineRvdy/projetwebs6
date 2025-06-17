<?php
require_once 'database.php';

// Désactive l'affichage des erreurs HTML
ini_set('display_errors', 0);
header('Content-Type: application/json');

try {
    $db = dbConnect(); // Utilisez votre fonction de connexion
    
    $query = "
        SELECT  
    COALESCE(v.mmsi, d.MMSI) AS mmsi,
    COALESCE(v.BaseDateTime, d.BaseDateTime) AS BaseDateTime,
    COALESCE(v.latitude, d.LAT) AS latitude,
    COALESCE(v.longitude, d.LON) AS longitude,
    COALESCE(v.sog, d.SOG) AS sog,
    COALESCE(v.cog, d.COG) AS cog,
    COALESCE(v.heading, d.Heading) AS heading,
    COALESCE(c.VesselName, d.VesselName) AS vesselName,
    COALESCE(v.status, d.Status) AS status,
    COALESCE(d.Length, c.Length) AS Length,
    COALESCE(d.Width, c.Width) AS Width,
    c.VesselType,
    d.Draft,
    d.Cargo
FROM 
    (SELECT mmsi, MAX(BaseDateTime) AS last_update 
     FROM (
         SELECT mmsi, BaseDateTime FROM var
         UNION ALL
         SELECT MMSI AS mmsi, BaseDateTime FROM data
     ) AS combined 
     GROUP BY mmsi) AS latest
LEFT JOIN var v ON v.mmsi = latest.mmsi AND v.BaseDateTime = latest.last_update
LEFT JOIN data d ON d.MMSI = latest.mmsi AND d.BaseDateTime = latest.last_update
LEFT JOIN const c ON c.MMSI = latest.mmsi
ORDER BY COALESCE(v.BaseDateTime, d.BaseDateTime) DESC
LIMIT 200;
";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $ships = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Vérifie si des données ont été trouvées
    if (empty($ships)) {
        throw new Exception('Aucun navire trouvé dans la base de données');
    }

     // Formatage des résultats
    $formattedShips = array_map(function($ship) {
        return [
            'mmsi' => $ship['mmsi'],
            'BaseDateTime' => $ship['BaseDateTime'],
            'latitude' => $ship['latitude'],
            'longitude' => $ship['longitude'],
            'sog' => $ship['sog'],
            'cog' => $ship['cog'],
            'heading' => $ship['heading'],
            'vesselName' => $ship['vesselName'],
            'status' => $ship['status'],
            'Length' => $ship['Length'],
            'Width' => $ship['Width'],
            'VesselType' => $ship['VesselType'],
            'Draft' => $ship['Draft'],
            'Cargo' => $ship['Cargo']
        ];
    }, $ships);

    // Envoie la réponse JSON
    echo json_encode([
        'success' => true,
        'ships' => $formattedShips,
        'lastUpdate' => date('Y-m-d H:i:s')
    ]);

} catch (PDOException $e) {
    // Erreur de base de données
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de base de données: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    // Autres erreurs
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}