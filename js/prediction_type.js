// Configuration des statuts AIS
const STATUS_LABELS = [
    'En route avec moteur', 'Au mouillage', 'Non maître de sa manœuvre',
    'Manœuvrabilité restreinte', 'Contraint par son tirant d\'eau', 'Amarré',
    'Échoué', 'En train de pêcher', 'En route à la voile',
    'Réservé (HSC)', 'Réservé (WIG)', 'Réservé', 'Réservé', 'Réservé',
    'AIS-SART actif', 'Non défini'
];

// Icônes SVG inline
const ICONS = {
    info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>`,
    chart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y3="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>`,
    arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>`
};

// Récupère et valide les paramètres de l'URL
function getShipParams() {
    const params = new URLSearchParams(window.location.search);
    const payload = ['Status', 'Length', 'Width', 'Draft', 'Heading'].reduce((acc, key) => {
        acc[key] = parseFloat(params.get(key));
        return acc;
    }, {});
    
    if (Object.values(payload).some(isNaN)) {
        throw new Error('Paramètres invalides ou manquants');
    }
    return payload;
}

// Affiche les données du navire avec un style cohérent
function displayShipData(payload) {
    const shipDataDiv = document.getElementById('shipData');
    if (!shipDataDiv) return;
    
    shipDataDiv.innerHTML = `
        <div class="data-container">
            <table class="data-table">
                <tr>
                    <th>Statut</th>
                    <td>${STATUS_LABELS[payload.Status] || 'Inconnu'}</td>
                </tr>
                <tr>
                    <th>Longueur</th>
                    <td>${payload.Length.toFixed(1)} m</td>
                </tr>
                <tr>
                    <th>Largeur</th>
                    <td>${payload.Width.toFixed(1)} m</td>
                </tr>
                <tr>
                    <th>Tirant d'eau</th>
                    <td>${payload.Draft.toFixed(1)} m</td>
                </tr>
                <tr>
                    <th>Cap</th>
                    <td>${payload.Heading.toFixed(1)}°</td>
                </tr>
            </table>
        </div>
    `;
}

// Effectue la prédiction du type de navire
async function predictShipType(payload) {
    try {
        console.log('Envoi des données au serveur:', payload);
        const response = await fetch('php/prediction.php?type', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        
        // Vérifier si la réponse est vide
        const responseText = await response.text();
        console.log('Réponse brute du serveur:', responseText);
        
        let data;
        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            console.error('Erreur lors du parsing de la réponse JSON:', e);
            throw new Error('Format de réponse invalide du serveur');
        }
        
        if (!response.ok) {
            throw new Error(data.error || `Erreur HTTP ${response.status}`);
        }
        
        console.log('Données parsées:', data);
        return data;
    } catch (error) {
        console.error('Erreur lors de la prédiction:', error);
        throw error;
    }
}

// Affiche le résultat de la prédiction
function displayPredictionResult(result) {
    const predictionDiv = document.getElementById('typePrediction');
    if (!predictionDiv) return;
    
    // Vérifier si le résultat est une chaîne (cas où le script Python renvoie directement le type)
    const predictionType = result.type || result.predicted_type || 'Inconnu';
    
    predictionDiv.className = 'prediction-result';
    predictionDiv.innerHTML = `
        <h3>Type prédit : ${predictionType}</h3>
        <div class="prediction-details">
            <p>Basé sur l'analyse des caractéristiques du navire</p>
        </div>
    `;
}

// Affiche un message d'erreur
function displayError(error) {
    const errorDiv = document.getElementById('typePrediction');
    if (!errorDiv) return;
    
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <h3>Erreur lors de l'analyse</h3>
        <p>${error.message || 'Une erreur inattendue est survenue'}</p>
        <button onclick="window.location.reload()" class="btn">
            ${ICONS.arrowLeft} Réessayer
        </button>
    `;
}

// Point d'entrée principal
async function init() {
    try {
        const payload = getShipParams();
        displayShipData(payload);
        
        // Afficher le chargement
        document.getElementById('typePrediction').innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Analyse des données en cours...</p>
            </div>
        `;
        
        const result = await predictShipType(payload);
        displayPredictionResult(result);
    } catch (error) {
        console.error('Erreur:', error);
        displayError(error);
    }
}

document.addEventListener('DOMContentLoaded', init);
