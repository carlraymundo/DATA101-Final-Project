mapboxgl.accessToken = 'pk.eyJ1IjoiYXNkZmdlaXN0IiwiYSI6ImNrcngwdTZjaTBtMDQyd2szcDdxdWpmb2IifQ.4nNuy2MKxtc5Cd82sENkMQ';

var regionID = {};
regionID[0]="Region I";
regionID[1]="Region II";
regionID[2]="Region III";
regionID[3]="Region IV-A";
regionID[4]="Region IV-B";
regionID[5]="Region V";
regionID[6]="Region VI";
regionID[7]="Region VII";
regionID[8]="Region VIII";
regionID[9]="Region IX";
regionID[10]="Region X";
regionID[11]="Region XI";
regionID[12]="Region XII";
regionID[13]="Region XIII";
regionID[14]="CAR";
regionID[15]="NCR";
regionID[16]="ARMM";
var currRegion = 0;

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
    maximumFractionDigits:2
})

map.on('load', () =>{
    map.getCanvas().style.cursor = '';
    map.addSource('phregions', {
       type: 'vector',
        url: 'mapbox://asdfgeist.benj7kbg'
    });
    map.addLayer({
        id: 'fies',
        type: 'fill',
        source: 'phregions',
        'source-layer': 'RegionsPhilippinesWithGini-7ysvm6',
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

    map.addLayer({
        id: 'highlight',
        type: 'fill',
        source: 'phregions',
        'source-layer': 'RegionsPhilippinesWithGini-7ysvm6',
        paint: {
            'fill-color': '#335577'
         },
        'filter': ['in', 'REGION', '']
    
    });
    
    console.log(map);
    map.on('click', 'fies', (e) => {
        /*new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("<b>"+e.features[0].properties['REGION']+"</b><br><p>"+'Mean Income: '+currFormatter.format(parseFloat(e.features[0].properties['mean_income'])))
            .addTo(map);*/
        document.getElementById("regionalFamExpenditure").innerHTML = currFormatter.format(parseFloat(e.features[0].properties['mean_expenditure']));
        document.getElementById("regionalFamIncome").innerHTML = currFormatter.format(parseFloat(e.features[0].properties['mean_income']));
        document.getElementById("regionalHouseSize").innerHTML = parseFloat(e.features[0].properties['mean_family_size']).toFixed(2);
        document.getElementById("regionalGiniValue").innerHTML = e.features[0].properties['gini'];
        /*document.getElementById("regionalName").innerHTML = e.features[0].properties['REGION'];*/
        /*map.fitBounds(e.target.getBounds());*/
            /*.setHTML("<b>"+e.features[0].properties['REGION']+"</b><br><p>"+'Mean Income: '+
                        currFormatter.format(parseFloat(e.features[0].properties['mean_income']))+
                        "<br>Respondents: "+e.features[0].properties['count'])
            .addTo(map);*/

        
        if (phGini > parseFloat(e.features[0].properties['gini'])){
            document.getElementById("gini-national-comparison").innerHTML =  "<b class='text-success'>" + (phGini - parseFloat(e.features[0].properties['gini'])).toFixed(4) +"</b>"+ " More than the national index."
            // document.getElementById("gini-national").innerHTML = phGini - parseFloat(e.features[0].properties['gini']);
            // console.log(phGini - parseFloat(e.features[0].properties['gini']))
        } else{
            document.getElementById("gini-national-comparison").innerHTML = "<b class='text-danger'>" + (parseFloat(e.features[0].properties['gini']) - phGini).toFixed(4) +"</b>"+ " Less than the national index."
            // document.getElementById("gini-national").innerHTML = (parseFloat(e.features[0].properties['gini']) - phGini).toFixed(4)
            // console.log(parseFloat(e.features[0].properties['gini']) - phGini)
        }

        if (phMeanFamily > parseFloat(e.features[0].properties['mean_family_size'])){
            document.getElementById("famsize-national-comparison").innerHTML =  "<b class='text-success'>" + (phMeanFamily - parseFloat(e.features[0].properties['mean_family_size'])).toFixed(2) +"</b>"+ " More than the national average."
            // document.getElementById("gini-national").innerHTML = phGini - parseFloat(e.features[0].properties['gini']);
            // console.log(phGini - parseFloat(e.features[0].properties['gini']))
        } else{
            document.getElementById("famsize-national-comparison").innerHTML = "<b class='text-danger'>" + (parseFloat(e.features[0].properties['mean_family_size']) - phMeanFamily).toFixed(2) +"</b>"+ " Less than the national average."
            // document.getElementById("gini-national").innerHTML = (parseFloat(e.features[0].properties['gini']) - phGini).toFixed(4)
            // console.log(parseFloat(e.features[0].properties['gini']) - phGini)
        }
    });
    map.on('mousemove', 'fies', (e) => {
        console.log('asfd');
        map.getCanvas().style.cursor = 'pointer';
        console.log(currRegion);
        if (e.features.length > 0) {
            /*const sameRegion = map.querySourceFeatures('counties', {
                sourceLayer: 'RegionsPhilippinesWithGini-7ysvm6',
                filter: ['get', 'REGION', e.features[0].properties['REGION']]
            });*/
            if (currRegion !== null) {
                /*clear*/
                map.setFilter('highlight', ['==', ['get', 'REGION'],null]);
            }
            currRegion = e.features[0].properties['REGION'];
            console.log(currRegion);
            
            map.setFilter('highlight', ['==', ['get', 'REGION'], e.features[0].properties['REGION']])
            currRegion = null;
            console.log(currRegion);
        }
    });
    map.on('mouseleave', 'fies', (e) => {
        if (currRegion !== null) {
            /*clear*/
            map.setFilter('highlight', ['==', ['get', 'REGION'],null])
        }
        currRegion = null;
        console.log(currRegion);
    });
    
  // datasets
  let data1 = [{key: 'I', value: 30},{key: 'II', value: 20},
               {key: 'III', value: 50},{key: 'IV-A', value: 80},
               {key: 'IV-b', value: 80},{key: 'V', value: 30},
               {key: 'VI', value: 70},{key: 'VII', value: 60},
               {key: 'VIII', value: 40},{key: 'IX', value: 40},
               {key: 'X', value: 40},{key: 'XI', value: 40},
               {key: 'XII', value: 40},{key: 'XIII', value: 40},
               {key: 'ARMM', value: 40},{key: 'CAR', value: 40},
               {key: 'NCR', value: 40}];
  let data2 = [{key: 'I', value: 30},{key: 'II', value: 20},
               {key: 'III', value: 50},{key: 'IV-A', value: 80},
               {key: 'IV-A', value: 80},{key: 'V', value: 30},
               {key: 'VI', value: 70},{key: 'VII', value: 60},
               {key: 'VIII', value: 40},{key: 'IX', value: 40},
               {key: 'X', value: 40},{key: 'XI', value: 40},
               {key: 'XII', value: 40},{key: 'XIII', value: 40},
               {key: 'ARMM', value: 40},{key: 'CAR', value: 40},
               {key: 'NCR', value: 40}];
  // chart dimensions 
  let width = 600, height = 400, margin = {t:10,b:30,l:30,r:10};
  // svg element
  let svg = d3.select('div#barContainer')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('border', 'solid 1px #222');
  // chart area
  let chart = svg.append('g')
      .classed('chart', true)
      .attr('transform', `translate(${margin.l},${margin.t})`);
  // axes areas
  let xAxis = svg.append('g')
      .classed('axis', true)
      .attr('transform', `translate(${margin.l},${height-margin.b})`);
  let yAxis = svg.append('g')
      .classed('axis', true)
      .attr('transform', `translate(${margin.l},${margin.t})`);
  // update function
  function updateData(dataset){
      // transitions
      let d = 500;
      let tRemove = d3.transition()
          .duration(d);
      let tPosition = d3.transition()
          .duration(d)
          .delay(d);
      let tSize = d3.transition()
          .duration(d)
          .delay(d*2);
      // scales
      let xScale = d3.scaleLinear()
          .domain([0, d3.max(dataset, d=>d.value)])
          .range([0, width-margin.l-margin.r]);
      let yScale = d3.scaleBand()
          .domain(dataset.map(d=>d.key))
          .range([0, height-margin.t-margin.b])
          .padding(0.2);
      // axes
      d3.axisBottom(xScale)(xAxis.transition(tSize));
      d3.axisLeft(yScale)(yAxis.transition(tPosition));
      // update pattern
      // initial selection
      bars = chart.selectAll('rect.bar');
      // data binding
      bars = bars.data(dataset, d=>d.key);
      // exit selection
      bars.exit()
          .classed('obs', true)
          .transition(tRemove)
          .attr('width', 0)
          .remove();

      // enter selection
      let barsEnter = bars.enter().append('rect')
          .classed('bar new', true)
          .attr('x', xScale(0))
          .on('mouseover', function(e,d){
              d3.select(this).classed('highlight', true);
          })
          .on('mouseout', function(e,d){
              d3.select(this).classed('highlight', false);
          });
      // update selection
      bars.classed('new', false);
      // enter + update selection
      bars.merge(barsEnter)
          .transition(tPosition)
          .attr('y', d=>yScale(d.key))
          .attr('height', yScale.bandwidth())
          .transition(tSize)
          .attr('width', d=>xScale(d.value));
      // class reset
      setTimeout(()=>{bars.merge(barsEnter).classed('new', false)}, d*4)
  }

  setTimeout(()=>{updateData(data1)}, 2000)
  setTimeout(()=>{updateData(data2)}, 6000)
});