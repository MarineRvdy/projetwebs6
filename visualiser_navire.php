<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visualiser Navire</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
</head>
<body>
<?php include('php/navbar.php'); ?>

<div class="visualization-page">
  <h1 style="text-align: center; margin-bottom: 20px;">Visualisation des Navires</h1>

  <!-- Carte Leaflet -->
  <div class="table-card" style="margin-bottom: 30px;">
    <div class="card-header">Carte des Trajectoires</div>
    <div class="card-body">
      <div id="shipMap"></div>
    </div>
    <div class="card-footer">
      ℹ️ Cliquez sur un point pour voir les détails
    </div>
  </div>

  <!-- Filtres -->
  <div class="table-card" style="margin-bottom: 20px;">
    <div class="card-header">Filtres</div>
    <div class="card-body">
      <div class="filter-container">
        <div class="filter-group">
          <label for="shipNameFilter">Nom du navire :</label>
          <input type="text" id="shipNameFilter" class="filter-input" placeholder="Rechercher par nom...">
        </div>
        
        <div class="filter-group">
          <label for="statusFilter">Statut :</label>
          <select id="statusFilter" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="En route avec moteur">En route avec moteur</option>
            <option value="Au mouillage">Au mouillage</option>
            <option value="Non maître de sa manœuvre">Non maître de sa manœuvre</option>
            <option value="Manœuvrabilité restreinte">Manœuvrabilité restreinte</option>
            <option value="Contraint par son tirant d'eau">Contraint par son tirant d'eau</option>
            <option value="Amarré">Amarré</option>
            <option value="Échoué">Échoué</option>
            <option value="En train de pêcher">En train de pêcher</option>
            <option value="En route à la voile">En route à la voile</option>
          </select>
        </div>
      </div>
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
            <!-- Données injectées par JS -->
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Boutons -->
  <div class="btn-group">
    <button id="btnCluster" class="btn btn-warning">Prédire les clusters</button>
    <button id="btnType" class="btn btn-info">Prédire le type</button>
    <button id="btnTrajectoire" class="btn btn-success">Prédire la trajectoire</button>
  </div>
</div>

<?php include('php/footer.php'); ?>

<!-- Leaflet -->
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<!-- JS personnalisé -->
<script src="js/visualiser_navire.js"></script>
</body>
</html>
