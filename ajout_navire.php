<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajout Navire</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php include('php/navbar.php'); ?>
    <div class="background-img ajout-bg">
        <div class="form-container">
            <h2>Ajouter un point de donnée</h2>
            <form id="addShipForm">
                <label>MMSI</label><input type="text" name="mmsi"><br>
                <label>Horodatage de la donnée</label><input type="text" name="timestamp"><br>
                <label>LAT/LON</label><input type="text" name="latlon"><br>
                <label>SOG / COG</label><input type="text" name="sogcog"><br>
                <label>Nom</label><input type="text" name="name"><br>
                <label>Status</label><select name="status"><option value=""></option></select><br>
                <label>Length/Width/Draft</label><input type="text" name="lwd"><br>
                <button type="submit">Ajouter</button>
            </form>
        </div>
    </div>
    <?php include('php/footer.php'); ?>
    <script src="js/ajout_navire.js"></script>
</body>
</html>
