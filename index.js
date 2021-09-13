mapboxgl.accessToken = 'pk.eyJ1IjoiYXNkZmdlaXN0IiwiYSI6ImNrcngwdTZjaTBtMDQyd2szcDdxdWpmb2IifQ.4nNuy2MKxtc5Cd82sENkMQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/asdfgeist/ckti3tekg2oo918wb39r6w2o1',
    center: [120.99, 14.56],
    zoom: 2,
    minZoom: 2,
    maxZoom: 15
});

map.on('load', () =>{
    map.addSource('phregions', {
       type: 'vector',
        url: 'mapbox://asdfgeist.ckti3hatq475928p7ejnhbr21-0d2bl'
    });
    map.addLayer({
        id: 'fies',
        type: 'fill',
        source: 'phregions',
        'source-layer': 'RegionsGini',
        paint: {
            'fill-color': /*'#ff00ff'*/
                ['interpolate',
                ['linear'],
                ['get', 'gini'],
                0,'#edf8fb',
                0.1,'#ccece6',
                0.2,'#99d8c9',
                0.3,'#66c2a4',
                0.4,'#41ae76',
                0.5,'#238b45'],
            'fill-outline-color': '#555555'
         }
    
    });

    
    console.log(map);
    map.on('click', 'fies', (e) => {
        console.log(typeof e);
        console.log(typeof e);
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("<b>"+e.features[0].properties['REGION']+"</b><br><p>"+'Mean Income: '+e.features[0].properties['mean_income'])
            .addTo(map);
        document.getElementById("regionalFamExpenditure").innerHTML = e.features[0].properties['mean_expenditure']
        document.getElementById("regionalFamIncome").innerHTML = e.features[0].properties['mean_income']
        document.getElementById("regionalHouseSize").innerHTML = e.features[0].properties['mean_family_size']
        document.getElementById("regionalGiniValue").innerHTML = e.features[0].properties['gini']
    });
});