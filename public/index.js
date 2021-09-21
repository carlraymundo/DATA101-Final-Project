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
var selectRegion = 0;

const phGini = 0.4267;
const phMeanFamily = 4.4930;

let food = 0;
let clothes = 0;
let hh = 0;
let health = 0;
let fuel = 0;
let comm = 0;
let trans = 0;
let educ = 0;
let rec =0;
let misc =0;
let furni = 0;
let rent = 0;
let occa = 0;
let other = 0;
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

    const legend = document.getElementById('legend');
    const layers = [
                  '0<=x<0.1',
                  '0.1<=x<0.2',
                  '0.2<=x<0.3',
                  '0.3<=x<0.4',
                  '0.4<=x<0.5',
                  '0.5<=x'];
    const colors = [
                '#ffffff',
                '#e0fff3',
                '#ace6cf',
                '#7ac2a5',
                '#217a57',
                '#093b27'];

    layers.forEach((layer, i) => {
      const color = colors[i];
      const item = document.createElement('div');
      const key = document.createElement('span');
      key.className = 'legend-key';
      key.style.backgroundColor = color;

      const value = document.createElement('span');
      value.innerHTML = `${layer}`;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    });
    map.addLayer({
        id: 'highlight',
        type: 'line',
        source: 'phregions',
        'source-layer': 'RegionsPhilippinesWithGini-7ysvm6',
        paint: {
            'line-color': '#DD8855',
            'line-width': 2
         },
        'filter': ['in', 'REGION', '']
    
    });
    map.addLayer({
        id: 'selected',
        type: 'fill',
        source: 'phregions',
        'source-layer': 'RegionsPhilippinesWithGini-7ysvm6',
        paint: {
            'fill-color': '#DD8855'
         },
        'filter': ['in', 'REGION', '']
    
    });
    
    console.log(map);
    map.on('click', 'fies', (e) => {
        /*new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("<b>"+e.features[0].properties['REGION']+"</b><br><p>"+'Mean Income: '+currFormatter.format(parseFloat(e.features[0].properties['mean_income'])))
            .addTo(map);*/
        document.getElementById("regionalFamExpenditure").innerHTML = currFormatter.format(parseFloat(e.features[0].properties['mean_expenditure']).toFixed(2));
        document.getElementById("regionalFamIncome").innerHTML = currFormatter.format(parseFloat(e.features[0].properties['mean_income']).toFixed(2));
        document.getElementById("regionalHouseSize").innerHTML = parseFloat(e.features[0].properties['mean_family_size']).toFixed(2);
        document.getElementById("regionalGiniValue").innerHTML = e.features[0].properties['gini'];
        document.getElementById("regionname").innerHTML = e.features[0].properties['REGION'];
        /*map.fitBounds(e.target.getBounds());*/
            /*.setHTML("<b>"+e.features[0].properties['REGION']+"</b><br><p>"+'Mean Income: '+
                        currFormatter.format(parseFloat(e.features[0].properties['mean_income']))+
                        "<br>Respondents: "+e.features[0].properties['count'])
            .addTo(map);*/

        /*
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
        }*/
            food = parseFloat(e.features[0].properties['mean_food_exp']);
            clothes = parseFloat(e.features[0].properties['mean_clothes_exp']);
            hh = parseFloat(e.features[0].properties['mean_furnishings_exp']);
            health = parseFloat(e.features[0].properties['mean_health_exp']);
            fuel = parseFloat(e.features[0].properties['mean_fuels_exp']);
            comm = parseFloat(e.features[0].properties['mean_comms_exp']);
            trans = parseFloat(e.features[0].properties['mean_transpo_exp']);
            educ = parseFloat(e.features[0].properties['mean_educ_exp']);
            rec = parseFloat(e.features[0].properties['mean_recs_exp']);
            misc = parseFloat(e.features[0].properties['mean_misc_exp']);
            furni = parseFloat(e.features[0].properties['mean_furniture_exps']);
            rent = parseFloat(e.features[0].properties['mean_rent_exp']);
            occa = parseFloat(e.features[0].properties['mean_occasions_exp']);
            other = parseFloat(e.features[0].properties['mean_others_exp']);

          let dataUpdate = [{key: 'Food', value: food},{key: 'Clothes', value: clothes},
                       {key: 'Household', value: hh},{key: 'Health', value: health},
                       {key: 'Fuel', value: fuel},{key: 'Communication', value: comm},
                       {key: 'Transportation', value: trans},{key: 'Education', value: educ},
                       {key: 'Recreation', value: rec},{key: 'Miscellany', value: misc},
                       {key: 'Furniture', value: furni},{key: 'Rent', value: rent},
                        {key: 'Occasions', value: occa},{key: 'Other', value: other}];
        
        updateData(dataUpdate);
        if (selectRegion !== null) {
            /*clear*/
            map.setFilter('selected', ['==', ['get', 'REGION'],null]);
        }
        selectRegion = e.features[0].properties['REGION'];

        map.setFilter('selected', ['==', ['get', 'REGION'], e.features[0].properties['REGION']])
        selectRegion = null;
    });
    map.on('mousemove', 'fies', (e) => {
        map.getCanvas().style.cursor = 'pointer';
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
            
            map.setFilter('highlight', ['==', ['get', 'REGION'], e.features[0].properties['REGION']])
            currRegion = null;
        }
    });
    map.on('mouseleave', 'fies', (e) => {
        if (currRegion !== null) {
            /*clear*/
            map.setFilter('highlight', ['==', ['get', 'REGION'],null])
        }
        currRegion = null;
    });
    
  // datasets
  let dataRegion = [{key: 'Food', value: 0},{key: 'Clothes', value: 0},
               {key: 'Household', value: 0},{key: 'Health', value: 0},
               {key: 'Fuel', value: 0},{key: 'Communication', value: 0},
               {key: 'Transportation', value: 0},{key: 'Education', value: 0},
               {key: 'Recreation', value: 0},{key: 'Miscellany', value: 0},
               {key: 'Furniture', value: 0},{key: 'Rent', value: 0},
                {key: 'Occasions', value: 0},{key: 'Other', value: 200000}];
  // chart dimensions 
  let width = 850, height = 400, margin = {t:10,b:30,l:100,r:10};
  // svg element
      
    let svg = d3.select('div#barContainer2')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('border', 'solid 1px #fff');
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
    
    let svg2 = d3.select('div#barContainer')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('border', 'solid 1px #fff');
    
    let chart2 = svg2.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${margin.l},${margin.t})`);
          // axes areas
    let xAxis2 = svg2.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${margin.l},${height-margin.b})`);
    let yAxis2 = svg2.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${margin.l},${margin.t})`);
    updateData(dataRegion);
  var data = d3.csv("https://raw.githubusercontent.com/carlraymundo/DATA101-Final-Project/diego/data/aggdata.csv?token=AGC4UAD46DLLI2NWNAIN3S3BJH24G",
  function(d) {
    return {
      region: d.REGION,
      mean_expenditure: d.mean_expenditure,
      mean_family_size: d.mean_family_size,
      mean_income: d.mean_income,
      mean_reg_salary: d.mean_reg_salary,
      mean_seasonal_salary: d.mean_seasonal_salary,
      mean_entrep_inc: d.mean_entrep_inc,
      mean_others_salary: d.mean_others_salary,
      cash_abroad: d.cash_abroad,
      cash_domestic: d.cash_domestic,
      mean_food_exp: d.mean_food_exp,
      mean_clothes_exp: d.mean_clothes_exp,
      mean_furnishings_exp: d.mean_furnishings_exp,
      mean_health_exp: d.mean_health_exp,
      mean_fuels_exp: d.mean_fuels_exp,
      mean_rent_exp: d.mean_rent_exp,
      mean_transpo_exp: d.mean_transpo_exp,
      mean_comms_exp: d.mean_comms_exp,
      mean_recs_exp: d.mean_recs_exp,
      mean_educ_exp: d.mean_educ_exp,
      mean_misc_exp: d.mean_misc_exp,
      mean_furniture_exps: d.mean_furniture_exps,
      mean_occasions_exp: d.mean_occasions_exp,
      mean_others_exp: d.mean_others_exp,
      count: d.count
    };
  }).then(function(dataset) {
      // transitions
        console.log(dataset);
      let d = 500;
      let tRemove = d3.transition()
          .duration(d);
      let tPosition = d3.transition()
          .duration(d)
          .delay(d);
      let tSize = d3.transition()
          .duration(d)
          .delay(d*2);
      
      let regions = dataset.map(function(d) {return d.region; });
      // scales
      console.log(d3.max(dataset, function(d) { return d.mean_expenditure; }));
      let xScale = d3.scaleLinear()
          .domain([0, d3.max(dataset, d=>d.mean_expenditure)])
          .range([0, width-margin.l-margin.r]);
      let yScale = d3.scaleBand()
          .domain(regions)
          .range([0, height-margin.t-margin.b])
          .padding(0.2);
      // axes
      d3.axisBottom(xScale)(xAxis.transition(tSize));
      d3.axisLeft(yScale)(yAxis.transition(tPosition));
      // update pattern
      // initial selection
      bars = chart.selectAll('rect.bar');
      // data binding
      bars = bars.data(dataset, d=>d.region);
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
          .attr('y', d=>yScale(d.region))
          .attr('height', yScale.bandwidth())
          .transition(tSize)
          .attr('width', d=>xScale(d.mean_expenditure));
      // class reset
      setTimeout(()=>{bars.merge(barsEnter).classed('new', false)}, d*4)
  });
    
  // chart area
  // update function
  function updateData(dataset){
      // transitions
        console.log('qwe');
      let d = 500;
      let tRemove = d3.transition()
          .duration(d);
      let tPosition = d3.transition()
          .duration(d)
          .delay(d);
      let tSize = d3.transition()
          .duration(d)
          .delay(d*2);
      
      let categs = dataset.map(function(d) {return d.key; });
      // scales
      console.log(d3.max(dataset, function(d) { return d.value; }));
      console.log(d.value);
      let xScale = d3.scaleLinear()
          .domain([0, d3.max(dataset, d=>d.value)])
          .range([0, width-margin.l-margin.r]);
      let yScale = d3.scaleBand()
          .domain(categs)
          .range([0, height-margin.t-margin.b])
          .padding(0.2);
      // axes
      d3.axisBottom(xScale)(xAxis2.transition(tSize));
      d3.axisLeft(yScale)(yAxis2.transition(tPosition));
      // update pattern
      // initial selection
      bars = chart2.selectAll('rect.bar');
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

  //setTimeout(()=>{updateData1(data1)}, 2000)
  //setTimeout(()=>{updateData1(data2)}, 6000)
});