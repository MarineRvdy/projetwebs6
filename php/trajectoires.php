<?php
require_once 'database.php';
header('Content-Type: application/json');
ini_set('memory_limit', '512M');

try {
    $db = dbConnect();
    
    // Requête SQL combinant les données des tables 'var' et 'data'
    // Les colonnes sont sélectionnées dans un ordre spécifique pour correspondre aux indices numériques utilisés plus bas
    $query = "
        (SELECT mmsi, BaseDateTime, latitude, longitude, '' as vesselName, status, sog, cog, Draft 
         FROM var)
        UNION ALL
        (SELECT MMSI, BaseDateTime, LAT, LON, COALESCE(VesselName, ''), Status, SOG, COG, Draft 
         FROM data)
        ORDER BY 1, 2";

    $results = $db->query($query);
    $trajectories = [];
    
    while ($row = $results->fetch(PDO::FETCH_NUM)) {
        // Construction du tableau de trajectoires organisé par MMSI
        // Les indices numériques correspondent à l'ordre des colonnes dans la requête SQL
        $trajectories[$row[0]][] = [
            'BaseDateTime' => $row[1],
            'latitude'     => (float)$row[2],
            'longitude'    => (float)$row[3],
            'vesselName'   => $row[4],
            'status'       => $row[5] !== null ? (int)$row[5] : null,
            'sog'          => $row[6] !== null ? (float)$row[6] : null,
            'cog'          => $row[7] !== null ? (float)$row[7] : null,
            'draft'        => $row[8] !== null ? (float)$row[8] : null
        ];
    }

    // Encodage et envoi de la réponse JSON
    echo json_encode(['success' => true, 'trajectories' => $trajectories]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur serveur']);
}
