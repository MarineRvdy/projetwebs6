<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualiser Navire</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Styles spécifiques à la page de visualisation */
        .visualization-page {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .map-table-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        #shipMap {
            height: 600px;
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.1);
            background: #f8fafc;
        }
        
        .table-card {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        
        .table-container {
            flex: 1;
            overflow-y: auto;
        }
        
        /* Conserve tous vos styles existants */
        #shipTable th {
            position: sticky;
            top: 0;
            background-color: #346887;
            color: white;
            z-index: 10;
        }
        
        .radio-column {
            width: 40px;
            text-align: center;
        }
        
        tr.selected {
            background-color: #cfe2ff !important;
        }
        
        .btn-group {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        /* Responsive */
        @media (max-width: 992px) {
            .map-table-grid {
                grid-template-columns: 1fr;
            }
            
            #shipMap {
                height: 450px;
            }
        }
        
        @media (max-width: 576px) {
            #shipMap {
                height: 350px;
            }
            
            .btn-group button {
                min-width: 100%;
            }
        }
    </style>
</head>
<body>
    <?php include('php/navbar.php'); ?>
    
    <div class="visualization-page">
        <h1 class="text-center mb-4">Visualisation des Navires</h1>
        
        <div class="map-table-grid">
            <!-- Carte -->
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h2 class="h5 mb-0">Carte des Positions</h2>
                </div>
                <div class="card-body p-0">
                    <div id="shipMap"></div>
                </div>
                <div class="card-footer bg-light">
                    <small class="text-muted">
                        <i class="fas fa-info-circle me-1"></i> Cliquez sur un point pour voir les détails
                    </small>
                </div>
            </div>
            
            <!-- Tableau -->
            <div class="card shadow-sm table-card">
                <div class="card-header bg-primary text-white">
                    <h2 class="h5 mb-0">Liste des Bateaux</h2>
                </div>
                <div class="card-body p-0">
                    <div class="table-container">
                        <table id="shipTable" class="table table-striped table-hover mb-0">
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
            <button id="btnCluster" class="btn btn-warning">
                Prédire les clusters
            </button>
            <button id="btnType" class="btn btn-info">
                Prédire le type
            </button>
            <button id="btnTrajectoire" class="btn btn-success">
                Prédire la trajectoire
            </button>
        </div>
    </div>
    
    <?php include('php/footer.php'); ?>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <script src="js/visualiser_navire.js"></script>
</body>
</html>