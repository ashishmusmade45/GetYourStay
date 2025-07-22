// Check if mapToken is defined before using it
if (typeof mapToken !== 'undefined' && mapToken && coordinates) {
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({ 
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v12', 
        center: coordinates, 
        zoom: 9,
    });  

    console.log(coordinates); 

    const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates)
        .addTo(map);
} else {
    console.error('Mapbox token or coordinates not available');
    // Optionally show a message to the user
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Map not available. Please check your configuration.</p>';
    }
}

 