// Configuration
const CONFIG = {
    refreshInterval: 30000, // 30 secondes
    mapCenter: [25.0, -90.0],
    mapZoom: 5
};

// État de l'application
const state = {
    shipsData: [],
    filteredShips: [],
    selectedShipId: null,
    leafletMap: null,
    colorMap: {},
    filters: {
        shipName: '',
        status: ''
    }
};

// Initialisation de la carte
function initMap() {
    state.leafletMap = L.map('shipMap').setView(CONFIG.mapCenter, CONFIG.mapZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(state.leafletMap);
}

// Chargement des données des navires
async function loadShips() {
    try {
        const response = await fetch('php/navire.php?action=getShips');
        state.shipsData = (await response.json()).ships;
        updateShipTable();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Application des filtres
function applyFilters() {
    // Mettre à jour le tableau
    state.filteredShips = state.shipsData.filter(ship => matchesFilters(ship));
    updateShipTable();
    
    // Mettre à jour la carte
    loadTrajectories();
}

// Mise à jour du tableau des navires
function updateShipTable() {
    const tbody = document.querySelector('#shipTable tbody');
    tbody.innerHTML = state.filteredShips.map(ship => `
        <tr data-mmsi="${ship.mmsi}" class="${state.selectedShipId === ship.mmsi ? 'selected' : ''}">
            <td class="radio-column">
                <input type="radio" name="selectedShip" value="${ship.mmsi}" 
                    ${state.selectedShipId === ship.mmsi ? 'checked' : ''}>
            </td>
            <td><span class="color-dot" style="background-color: ${getColor(ship.mmsi)}"></span>${ship.mmsi}</td>
            <td>${formatDate(ship.BaseDateTime)}</td>
            <td>${formatCoord(ship.latitude)}</td>
            <td>${formatCoord(ship.longitude)}</td>
            <td>${formatNumber(ship.sog, 1)}</td>
            <td>${formatNumber(ship.cog, 1)}°</td>
            <td>${ship.vesselName || 'Inconnu'}</td>
            <td>${getStatus(ship.status)}</td>
            <td>${formatNumber(ship.Length, 1)}m</td>
            <td>${formatNumber(ship.Width, 1)}m</td>
            <td>${formatNumber(ship.Draft, 1)}m</td>
        </tr>
    `).join('');

    // Gestion des clics sur les lignes
    tbody.querySelectorAll('tr').forEach(row => {
        const radio = row.querySelector('input[type="radio"]');
        
        radio.onchange = () => {
            state.selectedShipId = radio.value;
            document.querySelectorAll('#shipTable tr').forEach(r => 
                r.classList.toggle('selected', r === row)
            );
        };
        
        row.onclick = (e) => {
            if (e.target.tagName !== 'INPUT') {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        };
    });
}

// Vérifie si un navire correspond aux filtres actuels
function matchesFilters(ship) {
    // Filtre par nom
    if (state.filters.shipName && 
        !ship.vesselName?.toLowerCase().includes(state.filters.shipName.toLowerCase())) {
        return false;
    }
    
    // Filtre par statut
    if (state.filters.status && getStatus(ship.status) !== state.filters.status) {
        return false;
    }
    
    return true;
}

// Chargement des trajectoires
async function loadTrajectories() {
    try {
        const response = await fetch('php/trajectoires.php');
        const data = await response.json();
        
        if (!data.success) return;
        
        // Supprimer les anciennes trajectoires
        state.leafletMap.eachLayer(layer => {
            if (layer instanceof L.Polyline) state.leafletMap.removeLayer(layer);
        });
        
        // Filtrer les trajectoires en fonction des filtres actuels
        const filteredTrajectories = {};
        
        Object.entries(data.trajectories).forEach(([mmsi, points]) => {
            if (!points?.length) return;
            
            // Trouver le navire correspondant
            const ship = state.shipsData.find(s => String(s.mmsi) === String(mmsi));
            
            // Vérifier si le navire correspond aux filtres
            if (ship && matchesFilters(ship)) {
                filteredTrajectories[mmsi] = points;
                
                const coords = points.map(p => [p.latitude, p.longitude]);
                const line = L.polyline(coords, { 
                    color: getColor(mmsi), 
                    weight: 3 
                }).addTo(state.leafletMap);

                
                line.bindPopup(`
                    <div class="ship-popup">
                        <div><strong>MMSI :</strong> ${mmsi}</div>
                        <div><strong>Nom :</strong> ${ship.vesselName || 'Inconnu'}</div>
                        <div><strong>Longueur :</strong> ${ship ? formatNumber(ship.Length, 1) + 'm' : 'N/A'}</div>
                        <div><strong>Largeur :</strong> ${ship ? formatNumber(ship.Width, 1) + 'm' : 'N/A'}</div>
                        <div><strong>Tirant d'eau :</strong> ${ship ? formatNumber(ship.Draft, 1) + 'm' : 'N/A'}</div>
                        <div><strong>Statut :</strong> ${getStatus(ship.status)}</div>
                    </div>
                `);
            }
        });
        
        // Ajuster la vue pour s'adapter aux trajectoires filtrées
        const visiblePoints = Object.values(filteredTrajectories).flat();
        if (visiblePoints.length > 0) {
            const bounds = L.latLngBounds(
                visiblePoints.map(p => [p.latitude, p.longitude])
            );
            state.leafletMap.fitBounds(bounds);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Gestion des boutons de prédiction
function setupButtons() {
    const actions = {
        'btnCluster': () => window.location.href = `prediction_cluster.php?mmsi=${state.selectedShipId}`,
        'btnType': () => {
            const ship = state.shipsData.find(s => s.mmsi === state.selectedShipId);
            if (!ship) return alert('Navire introuvable');
            const params = new URLSearchParams({
                Status: ship.status,
                Length: ship.Length,
                Width: ship.Width,
                Draft: ship.Draft || 0,
                Heading: ship.cog || 0
            });
            window.location.href = `prediction_type.php?${params}`;
        },
        'btnTrajectoire': () => window.location.href = `prediction_trajectoire.php?mmsi=${state.selectedShipId}`
    };
    
    Object.entries(actions).forEach(([id, action]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = () => state.selectedShipId ? action() : alert('Veuillez sélectionner un navire');
        }
    });
}

// Fonctions utilitaires
function getColor(mmsi) {
    if (!state.colorMap[mmsi]) {
        const hash = String(mmsi).split('').reduce((a, c) => c.charCodeAt(0) + ((a << 5) - a), 0);
        state.colorMap[mmsi] = `hsl(${Math.abs(hash) % 360}, 80%, 50%)`;
    }
    return state.colorMap[mmsi];
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString('fr-FR');
}

function formatNumber(num, decimals) {
    const n = parseFloat(num);
    return isNaN(n) ? 'N/A' : n.toFixed(decimals);
}

function formatCoord(coord) {
    const n = parseFloat(coord);
    return isNaN(n) ? 'N/A' : n.toFixed(4);
}

function getStatus(code) {
    return [
        'En route avec moteur', 'Au mouillage', 'Non maître de sa manœuvre',
        'Manœuvrabilité restreinte', 'Contraint par son tirant d\'eau',
        'Amarré', 'Échoué', 'En train de pêcher', 'En route à la voile'
    ][code] || 'Inconnu';
}

// Configuration des gestionnaires d'événements pour les filtres
function setupFilters() {
    // Gestionnaire pour le filtre de nom
    document.getElementById('shipNameFilter').addEventListener('input', (e) => {
        state.filters.shipName = e.target.value;
        applyFilters();
    });
    
    // Gestionnaire pour le filtre de statut
    document.getElementById('statusFilter').addEventListener('change', (e) => {
        state.filters.status = e.target.value || '';
        applyFilters();
    });
    
    // Gestionnaire pour la touche Entrée dans le champ de recherche
    document.getElementById('shipNameFilter').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupButtons();
    setupFilters();
    
    // Chargement initial
    loadShips().then(() => {
        // Initialiser les filtres après le chargement des données
        applyFilters();
        // Charger les trajectoires après avoir appliqué les filtres
        loadTrajectories();
    });
    
    // Mise à jour périodique
    setInterval(() => {
        loadShips();
        loadTrajectories();
    }, CONFIG.refreshInterval);
});
