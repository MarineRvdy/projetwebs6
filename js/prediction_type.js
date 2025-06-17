document.addEventListener('DOMContentLoaded', () => {
    // Récupération des paramètres dans l'URL
    const params = new URLSearchParams(window.location.search);

    const payload = {
        Status: parseInt(params.get('Status')),
        Length: parseFloat(params.get('Length')),
        Width: parseFloat(params.get('Width')),
        Draft: parseFloat(params.get('Draft')),
        Heading: parseFloat(params.get('Heading'))
    };

    // Vérifier que les paramètres existent et sont valides
    if (Object.values(payload).some(v => isNaN(v) || v === null)) {
        document.getElementById('typePrediction').innerText = "Paramètres invalides ou manquants.";
        return;
    }

    fetch('php/prediction.php?type', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.getElementById('typePrediction').innerText = "Erreur : " + data.error;
        } else {
            document.getElementById('typePrediction').innerText = data.type;
        }
    })
    .catch(err => {
        document.getElementById('typePrediction').innerText = "Erreur serveur : " + err;
    });
});
