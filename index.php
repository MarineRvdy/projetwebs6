<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accueil - Projet Navires</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
    <?php include('php/navbar.php'); ?>
    <div class="background-img home-bg">
        <div class="project-description">
            <div class="objectif-section">
    <div class="objectif-header" style="background:#bdbdbd; color:white; padding:8px; border-radius:10px 10px 0 0; font-size:2em;">
        Objectif
    </div>
    <div class="objectif-content" style="border:1px solid #bdbdbd; border-radius:0 0 10px 10px; padding:20px; background:white;">
        <h2 style="text-align:center;">
            <b>Analyse et Modélisation des Comportements de Navigation<br>
            des Navires à partir des Données AIS</b>
        </h2>
        <p>
            Approfondir les compétences acquises dans les modules <b><i>Big Data, Intelligence Artificielle, Développement Web</i></b> et <b><i>Base de Données</i></b> à travers une application complète de traitements et de visualisation de données.
        </p>
        <h3 style="color:#e74c3c;">Objectifs de la partie Développement Web :</h3>
        <ul>
            <li>
                Programmation web côté client (<i>front-end</i>) :
                <ul>
                    <li>Créer une maquette visuelle d’un site web</li>
                    <li>Programmer les éléments de la maquette visuelle en <b>HTML</b></li>
                    <li>Programmer le style de la maquette visuelle en <b>CSS</b></li>
                    <li>Modifier le comportement de la page web en <b>JavaScript</b></li>
                    <li>Manipuler <b>AJAX</b></li>
                </ul>
            </li>
            <li>
                Programmation web côté serveur (<i>back-end</i>) :
                <ul>
                    <li>Créer un code <b>PHP</b> qui encapsule les requêtes permettant d’interagir avec la base de données</li>
                    <li>Traiter les réponses des requêtes en <b>PHP</b> et renvoyer des réponses au client</li>
                </ul>
            </li>
        </ul>
    </div>
</div>
        </div>
    </div>
    <div class="project-members">
        <h3>Membre du projet</h3>
        <div class="members-list">
            <div class="member"><img src="img/eliott.jpg" alt="Membre 1" /></div>
            <div class="member"><img src="img/guillaume.jpg" alt="Membre 2" /></div>
            <div class="member"><img src="img/Marine.jpg" alt="Membre 3" /></div>
    </div>
</div>
    <?php include('php/footer.php'); ?>
    <script src="js/main.js"></script>
</body>
</html>
