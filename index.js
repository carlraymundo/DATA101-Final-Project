mapboxgl.accessToken = 'pk.eyJ1IjoiYXNkZmdlaXN0IiwiYSI6ImNrcngwdTZjaTBtMDQyd2szcDdxdWpmb2IifQ.4nNuy2MKxtc5Cd82sENkMQ';

const phGini = 0.4267;
const phMeanFamily = 4.4930;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/asdfgeist/ckti3tekg2oo918wb39r6w2o1',
    center: [120.99, 14.56],
    zoom: 4,
    minZoom: 2,
    maxZoom: 15
});

var currFormatter = Intl.NumberFormat({
    style:'currency',
    currency:'PHP',
    minimumFractionDigits:1,
    maximumFractionDigits:1
})

map.on('load', () =>{
    map.addSource('phregions', {
       type: 'vector',
        url: 'mapbox://asdfgeist.ckti8vq4a0o5520tcvzp2qjsq-1ig0o'
    });
    map.addLayer({
        id: 'fies',
        type: 'fill',
        source: 'phregions',
        'source-layer': 'Regions_w_Gini_1.1',
        paint: {
            'fill-color': /*'#ff00ff'*/
                ['interpolate',
                ['linear'],
                ['get', 'gini'],
                0,'#ffffff',
                0.1,'#e0fff3',
                0.2,'#ace6cf',
                0.3,'#7ac2a5',
                0.4,'#217a57',
                0.5,'#093b27'],
            'fill-outline-color': '#555555'
         }
    
    });

    
    console.log(map);
    map.on('click', 'fies', (e) => {
        console.log(typeof e);
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("<b>"+e.features[0].properties['REGION']+"</b><br><p>"+'Mean Income: '+
                        currFormatter.format(parseFloat(e.features[0].properties['mean_income']))+
                        "<br>Respondents: "+e.features[0].properties['count'])
            .addTo(map);
        document.getElementById("regionalFamExpenditure").innerHTML = currFormatter.format(parseFloat(e.features[0].properties['mean_expenditure']))
        document.getElementById("regionalFamIncome").innerHTML = currFormatter.format(parseFloat(e.features[0].properties['mean_income']))
        document.getElementById("regionalHouseSize").innerHTML = parseFloat(e.features[0].properties['mean_family_size']).toFixed(2)
        document.getElementById("regionalGiniValue").innerHTML = parseFloat(e.features[0].properties['gini']).toFixed(4)
        document.getElementById("regionalName").innerHTML = e.features[0].properties['REGION']

        
        
        if (phGini > parseFloat(e.features[0].properties['gini'])){
            document.getElementById("gini-national-comparison").innerHTML =  "<b class='text-danger'>" + (phGini - parseFloat(e.features[0].properties['gini'])).toFixed(4) +"</b>"+ " Less than the national index."
            // document.getElementById("gini-national").innerHTML = phGini - parseFloat(e.features[0].properties['gini']);
            // console.log(phGini - parseFloat(e.features[0].properties['gini']))
        } else{
            document.getElementById("gini-national-comparison").innerHTML = "<b class='text-success'>" + (parseFloat(e.features[0].properties['gini']) - phGini).toFixed(4) +"</b>"+ " More than the national index."
            // document.getElementById("gini-national").innerHTML = (parseFloat(e.features[0].properties['gini']) - phGini).toFixed(4)
            // console.log(parseFloat(e.features[0].properties['gini']) - phGini)
        }

        if (phMeanFamily > parseFloat(e.features[0].properties['mean_family_size'])){
            document.getElementById("famsize-national-comparison").innerHTML =  "<b class='text-danger'>" + (phMeanFamily - parseFloat(e.features[0].properties['mean_family_size'])).toFixed(2) +"</b>"+ " Less than the national average."
            // document.getElementById("gini-national").innerHTML = phGini - parseFloat(e.features[0].properties['gini']);
            // console.log(phGini - parseFloat(e.features[0].properties['gini']))
        } else{
            document.getElementById("famsize-national-comparison").innerHTML = "<b class='text-success'>" + (parseFloat(e.features[0].properties['mean_family_size']) - phMeanFamily).toFixed(2) +"</b>"+ " More than the national average."
            // document.getElementById("gini-national").innerHTML = (parseFloat(e.features[0].properties['gini']) - phGini).toFixed(4)
            // console.log(parseFloat(e.features[0].properties['gini']) - phGini)
        }
    });
});