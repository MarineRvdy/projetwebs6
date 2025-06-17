document.addEventListener('DOMContentLoaded', () => {
    let shipsData = [];
    let selectedShipId = null;

    function loadShipsData() {
        fetch('php/navire.php?action=getShips')
            .then(res => res.json())
            .then(data => {
                shipsData = data.ships;
                populateShipTable(shipsData);
                updateShipMap(shipsData);
            })
            .catch(err => showError(err.message));
    }

    function populateShipTable(data) {
        const tableBody = document.querySelector('#shipTable tbody');
        tableBody.innerHTML = '';

        data.forEach(ship => {
            const row = document.createElement('tr');
            row.dataset.mmsi = ship.mmsi;
            if (selectedShipId === ship.mmsi) row.classList.add('selected');

            row.innerHTML = `
                <td class="radio-column">
                    <input type="radio" name="selectedShip" value="${ship.mmsi}" ${selectedShipId === ship.mmsi ? 'checked' : ''}>
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
                <td>${safeToFixed(ship.Draft, 1)}</td>
            `;

            const radioBtn = row.querySelector('input[type="radio"]');
            radioBtn.addEventListener('change', () => {
                if (radioBtn.checked) {
                    selectedShipId = ship.mmsi;
                    document.querySelectorAll('#shipTable tr').forEach(r => r.classList.remove('selected'));
                    row.classList.add('selected');
                }
            });

            row.addEventListener('click', e => {
                if (e.target.tagName !== 'INPUT') {
                    radioBtn.checked = true;
                    radioBtn.dispatchEvent(new Event('change'));
                }
            });

            tableBody.appendChild(row);
        });
    }

    function safeToFixed(value, decimals) {
        const num = parseFloat(value);
        return isNaN(num) ? 'N/A' : num.toFixed(decimals);
    }

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString('fr-FR');
    }

    function getStatusText(code) {
        return {
            0: 'En route',
            1: 'À l\'ancre',
            2: 'Non commandé',
            3: 'Manoeuvre restreinte',
            4: 'Limité par tirant d\'eau'
        }[code] || 'Inconnu';
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = message;
        document.querySelector('.container').prepend(errorDiv);
    }

    // Prédictions
    document.getElementById('btnCluster')?.addEventListener('click', () => {
        if (!selectedShipId) return alert('Veuillez sélectionner un navire');
        window.location.href = `prediction_cluster.php?mmsi=${selectedShipId}`;
    });

    document.getElementById('btnType')?.addEventListener('click', () => {
        if (!selectedShipId) return alert('Veuillez sélectionner un navire');
        const ship = shipsData.find(s => s.mmsi === selectedShipId);
        if (!ship) return alert('Navire introuvable');

        const params = new URLSearchParams({
            Status: ship.status,
            Length: ship.Length,
            Width: ship.Width,
            Draft: ship.Draft || 0,
            Heading: ship.cog || 0
        });

        window.location.href = `prediction_type.php?${params.toString()}`;
    });

    document.getElementById('btnTrajectoire')?.addEventListener('click', () => {
        if (!selectedShipId) return alert('Veuillez sélectionner un navire');
        window.location.href = `prediction_trajectoire.php?mmsi=${selectedShipId}`;
    });

    function initShipMap() {
        Plotly.newPlot('shipMap', [], {
            mapbox: {
                style: 'open-street-map',
                center: { lon: -4.5, lat: 48 },
                zoom: 5
            },
            margin: { t: 0, b: 0, l: 0, r: 0 },
            showlegend: false,
            hovermode: 'closest'
        }, {
            displayModeBar: true,
            scrollZoom: true,
            responsive: true
        });
    }

    function updateShipMap(ships) {
        if (!ships.length) return;

        const shipGroups = {};
        ships.forEach(ship => {
            if (!ship.latitude || !ship.longitude) return;

            const group = shipGroups[ship.mmsi] ??= {
                name: ship.vesselName || `Navire ${ship.mmsi}`,
                lat: [],
                lon: [],
                text: []
            };

            group.lat.push(ship.latitude);
            group.lon.push(ship.longitude);
            group.text.push(`
                MMSI: ${ship.mmsi}<br>
                Nom: ${group.name}<br>
                Vitesse: ${ship.sog || 'N/A'} nœuds<br>
                Cap: ${ship.cog || 'N/A'}°<br>
                État: ${getStatusText(ship.status)}
            `);
        });

        const plotlyData = Object.entries(shipGroups).map(([mmsi, data]) => ({
            type: 'scattermapbox',
            name: data.name,
            lon: data.lon,
            lat: data.lat,
            text: data.text,
            hoverinfo: 'text',
            mode: 'lines+markers',
            line: { width: 2, color: getShipColor(mmsi) },
            marker: { size: 8, color: getShipColor(mmsi) }
        }));

        Plotly.react('shipMap', plotlyData, {
            mapbox: {
                style: 'open-street-map',
                center: {
                    lon: ships[0].longitude || -4.5,
                    lat: ships[0].latitude || 48
                },
                zoom: 6
            },
            margin: { t: 0, b: 0, l: 0, r: 0 }
        });
    }

    function getShipColor(mmsi) {
        const colors = [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
            '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
        ];
        return colors[parseInt(mmsi) % colors.length];
    }

    // Initialisation
    initShipMap();
    loadShipsData();
    setInterval(loadShipsData, 30000);
});
