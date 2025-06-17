<?php
header('Content-Type: application/json');
// Endpoints template pour prédiction cluster/type/trajectoire
if (isset($_GET['cluster'])) {
    // TODO: Ajouter logique de prédiction cluster
    echo json_encode(['clusters' => []]);
    exit;
}
if (isset($_GET['type'])) {
    // TODO: Ajouter logique de prédiction type
    echo json_encode(['type' => '']);
    exit;
}
if (isset($_GET['trajectoire'])) {
    // TODO: Ajouter logique de prédiction trajectoire
    echo json_encode(['trajectoire' => []]);
    exit;
}
echo json_encode(['error' => 'Aucune prédiction demandée']);
