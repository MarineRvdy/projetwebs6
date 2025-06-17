document.getElementById('addShipForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = {
        mmsi: this.mmsi.value,
        timestamp: this.timestamp.value,
        latlon: this.latlon.value,
        sogcog: this.sogcog.value,
        name: this.name.value,
        status: this.status.value,
        lwd: this.lwd.value
    };
    const res = await fetch('php/navire.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if(result.success) {
        alert('Navire ajouté avec succès !');
        this.reset();
    } else {
        alert('Erreur lors de l\'ajout du navire.');
    }
});
