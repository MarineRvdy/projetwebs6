<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualiser Navire</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<body>
    <?php include('php/navbar.php'); ?>

    <div class="visualization-page">
        <h1 style="text-align: center; margin-bottom: 20px;">Visualisation des Navires</h1>

        <div class="map-table-grid">
            <!-- Carte -->
            <div class="table-card">
                <div class="card-header">Carte des Positions</div>
                <div class="card-body">
                    <div id="shipMap"></div>
                </div>
                <div class="card-footer">
                    ℹ️ Cliquez sur un point pour voir les détails
                </div>
            </div>

            <!-- Tableau -->
            <div class="table-card">
                <div class="card-header">Liste des Bateaux</div>
                <div class="card-body">
                    <div class="table-container">
                        <table id="shipTable">
                            <thead>
                                <tr>
                                    <th class="radio-column">Sélection</th>
                                    <th>MMSI</th>
                                    <th>Date</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th>Vitesse</th>
                                    <th>Cap</th>
                                    <th>Nom</th>
                                    <th>État</th>
                                    <th>Longueur</th>
                                    <th>Largeur</th>
                                    <th>Tirant d'eau</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Les données seront injectées par JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Boutons d'action -->
        <div class="btn-group">
            <button id="btnCluster" class="btn btn-warning">Prédire les clusters</button>
            <button id="btnType" class="btn btn-info">Prédire le type</button>
            <button id="btnTrajectoire" class="btn btn-success">Prédire la trajectoire</button>
        </div>
    </div>

    <?php include('php/footer.php'); ?>

    <script src="js/visualiser_navire.js"></script>
</body>
</html>
