<?php
header('Content-Type: application/json');
// Endpoints template pour prédiction cluster/type/trajectoire
if (isset($_GET['cluster'])) {
    // TODO: Ajouter logique de prédiction cluster
    echo json_encode(['clusters' => []]);
    exit;
}
if (isset($_GET['type'])) {
    // Lire les données JSON envoyées
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Données JSON invalides.']);
        exit;
    }

    // Sécuriser les paramètres
    $status = escapeshellarg($data['Status'] ?? '');
    $length = escapeshellarg($data['Length'] ?? '');
    $width = escapeshellarg($data['Width'] ?? '');
    $draft = escapeshellarg($data['Draft'] ?? '');
    $heading = escapeshellarg($data['Heading'] ?? '');

    if (!$status || !$length || !$width || !$draft || !$heading) {
        http_response_code(400);
        echo json_encode(['error' => 'Paramètres manquants.']);
        exit;
    }

    // Appeler le script Python
    $command = "python3 ../python/script_predict_vesseltype.py --Status $status --Length $length --Width $width --Draft $draft --Heading $heading";
    $output = shell_exec($command . " 2>&1");  // ← redirige les erreurs vers la sortie standard


    if ($output === null || trim($output) === '') {
    http_response_code(500);
    echo json_encode(['error' => "Erreur lors de l'exécution du script. Détail : $output"]);
    exit;
}


    // Retour JSON
    echo json_encode(['type' => trim($output)]);
    exit;
}

if (isset($_GET['trajectoire'])) {
    // TODO: Ajouter logique de prédiction trajectoire
    echo json_encode(['trajectoire' => []]);
    exit;
}
echo json_encode(['error' => 'Aucune prédiction demandée']);
