<?php
header('Content-Type: application/json');
// Endpoints template pour prédiction cluster/type/trajectoire
if (isset($_GET['cluster'])) {
    // TODO: Ajouter logique de prédiction cluster
    echo json_encode(['clusters' => []]);
    exit;
}
if (isset($_GET['type'])) {
    // Récupération et validation des données
    $required = ['Status', 'Length', 'Width', 'Draft', 'Heading'];
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    
    // Vérification des champs requis
    $missing = array_diff($required, array_keys($data));
    if (!empty($missing)) {
        http_response_code(400);
        echo json_encode(['error' => 'Champs manquants: ' . implode(', ', $missing)]);
        exit;
    }
    
    // Vérification des valeurs vides
    $empty = array_filter($data, function($value) { return $value === '' || $value === null; });
    if (!empty($empty)) {
        http_response_code(400);
        echo json_encode(['error' => 'Les champs suivants ne peuvent pas être vides: ' . implode(', ', array_keys($empty))]);
        exit;
    }
    
    // Construction de la commande sécurisée
    $args = array_map('escapeshellarg', array_intersect_key($data, array_flip($required)));
    $command = sprintf(
        'python3 ../python/script_predict_vesseltype.py --Status %s --Length %s --Width %s --Draft %s --Heading %s 2>&1',
        ...array_values($args)
    );
    
    // Exécution et vérification
    if (($output = trim(shell_exec($command))) === '') {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de l\'exécution du script']);
        exit;
    }
    
    echo json_encode(['type' => $output]);
    exit;
}

if (isset($_GET['trajectoire'])) {
    // TODO: Ajouter logique de prédiction trajectoire
    echo json_encode(['trajectoire' => []]);
    exit;
}
echo json_encode(['error' => 'Aucune prédiction demandée']);
