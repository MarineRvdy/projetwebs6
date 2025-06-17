document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let shipsData = [];
    let selectedShipId = null;

    const mapboxAccessToken = 'pk.eyJ1IjoicHJvamV0czYiLCJhIjoiY21jMDNydzZ0MW9vMDJpczhsbHEzOHJoZyJ9.WEPhNizhmlquppVT--3akA'

    
    // Charger les données des navires
   function loadShipsData() {
    fetch('php/navire.php?action=getShips')
        .then(response => response.json())
        .then(data => {
            shipsData = data.ships;
            populateShipTable(shipsData);
            updateShipMap(shipsData); // Mettre à jour la carte
        })
        .catch(error => {
            console.error('Erreur:', error);
            showError(error.message);
        });
}
    
    // Remplir le tableau avec les données
    function populateShipTable(data) {
         const tableBody = document.querySelector('#shipTable tbody');
        tableBody.innerHTML = '';
        
        data.forEach(ship => {
            const row = document.createElement('tr');
            row.dataset.mmsi = ship.mmsi;
            
            if (selectedShipId === ship.mmsi) {
                row.classList.add('selected');
            }
            
            row.innerHTML = `
                <td class="radio-column">
                    <input type="radio" name="selectedShip" value="${ship.mmsi}" 
                        ${selectedShipId === ship.mmsi ? 'checked' : ''}>
                </td>
                <td>${ship.mmsi}</td>
                <td>${formatDateTime(ship.BaseDateTime)}</td>
                <td>${safeToFixed(ship.latitude, 4)}</td>
                <td>${safeToFixed(ship.longitude, 4)}</td>
                <td>${safeToFixed(ship.sog, 1)}</td>
                <td>${safeToFixed(ship.cog, 1)}</td>
                <td>${ship.vesselName || 'Inconnu'}</td>
                <td>${getStatusText(ship.status)}</td>
                <td>${safeToFixed(ship.Length, 1)}</td>
                <td>${safeToFixed(ship.Width, 1)}</td>
            `;
            
            const radioBtn = row.querySelector('input[type="radio"]');
            if (radioBtn) {
                radioBtn.addEventListener('change', function() {
                    if (this.checked) {
                        selectedShipId = ship.mmsi;
                        document.querySelectorAll('#shipTable tr').forEach(r => {
                            r.classList.remove('selected');
                        });
                        row.classList.add('selected');
                    }
                });
            }
            
            row.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT' && radioBtn) {
                    radioBtn.checked = true;
                    radioBtn.dispatchEvent(new Event('change'));
                }
            });
            
            tableBody.appendChild(row);
        });
    }
    
    
// Ajoutez ces fonctions utilitaires :
function safeToFixed(value, decimals) {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A';
    }
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 'N/A' : num.toFixed(decimals);
}

function formatDateTime(dateTime) {
    if (!dateTime) return 'N/A';
    try {
        const date = new Date(dateTime);
        return isNaN(date.getTime()) ? dateTime : date.toLocaleString('fr-FR');
    } catch (e) {
        return dateTime;
    }
}

function getStatusText(statusCode) {
    const statusMap = {
        0: 'En route',
        1: 'À l\'ancre',
        2: 'Non commandé',
        3: 'Manoeuvre restreinte',
        4: 'Limité par tirant d\'eau'
    };
    return statusMap[statusCode] || 'Inconnu';
}
    
    // Fonction pour afficher les erreurs
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = message;
        document.querySelector('.container').prepend(errorDiv);
    }
    
    // Gestionnaires d'événements pour les boutons
    document.getElementById('btnCluster')?.addEventListener('click', predictClusters);
    document.getElementById('btnType')?.addEventListener('click', predictType);
    document.getElementById('btnTrajectoire')?.addEventListener('click', predictTrajectory);
    
    // Fonctions de prédiction
    function predictClusters() {
        if (!selectedShipId) {
            alert('Veuillez sélectionner un navire');
            return;
        }
        window.location.href = `prediction_cluster.php?mmsi=${selectedShipId}`;
    }
    
    function predictType() {
        if (!selectedShipId) {
            alert('Veuillez sélectionner un navire');
            return;
        }
        window.location.href = `prediction_type.php?mmsi=${selectedShipId}`;
    }
    
    function predictTrajectory() {
        if (!selectedShipId) {
            alert('Veuillez sélectionner un navire');
            return;
        }
        window.location.href = `prediction_trajectoire.php?mmsi=${selectedShipId}`;
    }
    

    initShipMap();
    // Chargement initial des données
    loadShipsData();
    
    // Rafraîchissement automatique toutes les 30 secondes
    setInterval(loadShipsData, 30000);


    // Initialisation de la carte Plotly
    // Fonction pour initialiser la carte
function initShipMap() {
    const mapDiv = document.getElementById('shipMap');
    
    const layout = {
        mapbox: {
            style: 'streets',
            center: { lon: -4.5, lat: 48 }, // Centré sur la Bretagne
            zoom: 5,
            bearing: 0,
            pitch: 0
        },
        margin: { t: 0, b: 0, l: 0, r: 0 },
        showlegend: false,
        hovermode: 'closest',
        mapbox: {
            accesstoken: mapboxAccessToken
        }
    };
    
    Plotly.newPlot(mapDiv, [], layout, { 
        displayModeBar: true,
        scrollZoom: true,
        responsive: true
    });
    
    return mapDiv;
}

// Fonction pour mettre à jour les données sur la carte
function updateShipMap(ships) {
    if (!ships || ships.length === 0) return;
    
    // Grouper les positions par MMSI pour les trajectoires
    const shipGroups = {};
    ships.forEach(ship => {
        if (!shipGroups[ship.mmsi]) {
            shipGroups[ship.mmsi] = {
                name: ship.vesselName || `Navire ${ship.mmsi}`,
                lat: [],
                lon: [],
                text: []
            };
        }
        if (ship.latitude && ship.longitude) {
            shipGroups[ship.mmsi].lat.push(ship.latitude);
            shipGroups[ship.mmsi].lon.push(ship.longitude);
            shipGroups[ship.mmsi].text.push(
                `MMSI: ${ship.mmsi}<br>` +
                `Nom: ${ship.vesselName || 'Inconnu'}<br>` +
                `Vitesse: ${ship.sog || 'N/A'} nœuds<br>` +
                `Cap: ${ship.cog || 'N/A'}°<br>` +
                `État: ${getStatusText(ship.status)}`
            );
        }
    });
    
    // Préparer les données pour Plotly
    const plotlyData = Object.entries(shipGroups).map(([mmsi, data]) => {
        return {
            type: 'scattermapbox',
            name: data.name,
            lon: data.lon,
            lat: data.lat,
            text: data.text,
            hoverinfo: 'text',
            mode: 'lines+markers',
            line: {
                width: 2,
                color: getShipColor(mmsi)
            },
            marker: {
                size: 8,
                color: getShipColor(mmsi)
            }
        };
    });
    
    // Configuration de la carte avec style gratuit
    const layout = {
        mapbox: {
            style: "open-street-map", // Style libre (autres options: 'open-street-map', 'carto-positron', etc.)
            center: { 
                lon: ships[0]?.longitude || -4.5, 
                lat: ships[0]?.latitude || 48 
            },
            zoom: 6
        },
        margin: {t: 0, b: 0, l: 0, r: 0}
    };
    
    // Mettre à jour la carte
    Plotly.react('shipMap', plotlyData, layout);
}

// Fonction pour générer une couleur unique par navire
function getShipColor(mmsi) {
    const colors = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ];
    return colors[parseInt(mmsi) % colors.length];
}
});


