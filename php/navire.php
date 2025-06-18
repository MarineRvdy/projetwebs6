<?php
require_once 'database.php';

ini_set('display_errors', 0);
header('Content-Type: application/json');

try {
    $db = dbConnect();

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
            d.Draft
        FROM (
            SELECT mmsi, MAX(BaseDateTime) AS last_update 
            FROM (
                SELECT mmsi, BaseDateTime FROM var
                UNION ALL
                SELECT MMSI AS mmsi, BaseDateTime FROM data
            ) AS combined 
            GROUP BY mmsi
        ) AS latest
        LEFT JOIN var v ON v.mmsi = latest.mmsi AND v.BaseDateTime = latest.last_update
        LEFT JOIN data d ON d.MMSI = latest.mmsi AND d.BaseDateTime = latest.last_update
        LEFT JOIN const c ON c.MMSI = latest.mmsi
        ORDER BY COALESCE(v.BaseDateTime, d.BaseDateTime) DESC
        LIMIT 200;
    ";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $ships = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$ships) {
        throw new Exception('Aucun navire trouvé dans la base de données');
    }

    echo json_encode([
        'success' => true,
        'ships' => $ships,
        'lastUpdate' => date('Y-m-d H:i:s')
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de base de données : ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
