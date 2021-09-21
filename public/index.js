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

  // chart dimensions 
const width = 700, height = 400, margin = {t:10,b:30,l:170,r:10};
var region_color = d3.scaleOrdinal().range(["#8B0000","#2E8B57","#000080","#CCCC00","#ff709a","#696969","#FF7F50","#9400D3","#00FA9A","#8B4513","#708090","#00CED1","#006400", "#FF1493", "#CD853F", "#FFD700", "#191970"])
var exp_color = d3.scaleOrdinal().range(["#8B0000","#000080","#CCCC00","#ff709a","#696969","#FF7F50","#FFD700","#00FA9A","#8B4513","#4B0082","#00CED1","#006400","#CD853F", "#9400D3"])
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
                0.1,'#ccffdd',
                0.2,'#88cc99',
                0.3,'#448855',
                0.4,'#004411',
                0.5,'#000000'],
            'fill-outline-color': '#000000'
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
                '#ccffdd',
                '#88cc99',
                '#449966',
                '#004411',
                '#000000'];

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

        */
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
        
            reg = parseFloat(e.features[0].properties['mean_reg_salary']);
            season = parseFloat(e.features[0].properties['mean_seasonal_salary']);
            entrep = parseFloat(e.features[0].properties['mean_entrep_inc']);
            otherSal = parseFloat(e.features[0].properties['mean_others_salary']);
            abroad = parseFloat(e.features[0].properties['cash_abroad']);
            domestic = parseFloat(e.features[0].properties['cash_domestic']);

          let dataUpdate = [{key: 'Food', value: food},{key: 'Clothes', value: clothes},
                       {key: 'Household', value: hh},{key: 'Health', value: health},
                       {key: 'Fuel', value: fuel},{key: 'Communication', value: comm},
                       {key: 'Transportation', value: trans},{key: 'Education', value: educ},
                       {key: 'Recreation', value: rec},{key: 'Miscellany', value: misc},
                       {key: 'Furniture', value: furni},{key: 'Rent', value: rent},
                        {key: 'Occasions', value: occa},{key: 'Other', value: other}];
        
          let dataUpdateInc = [{key: 'Regular Income', value: reg},{key: 'Seasonal Income', value: season},
                       {key: 'Entrepreneurial Income', value: entrep},{key: 'Other Sources of Income', value: otherSal},
                       {key: 'Support From Abroad', value: abroad},{key: 'Support From Domestic Sources', value: domestic}];
        
        updateData(dataUpdate, chart2, xAxis2, yAxis2);
        updateData(dataUpdateInc, chart3, xAxis3, yAxis3);
        if (selectRegion !== null) {
            /*clear*/
            map.setFilter('selected', ['==', ['get', 'REGION'],null]);
        }
        selectRegion = e.features[0].properties['REGION'];

        map.setFilter('selected', ['==', ['get', 'REGION'], e.features[0].properties['REGION']])
        selectRegion = null;

        if (phMeanFamily > parseFloat(e.features[0].properties['mean_family_size'])){
            document.getElementById("famsize-comparison").innerHTML =  "<em><small><b class='text-success'>" + (phMeanFamily - parseFloat(e.features[0].properties['mean_family_size'])).toFixed(2) +"</b>"+ " more than the <span><abbr title='4.493'>nat'l average</span>.</small></em>"
        } else{
            document.getElementById("famsize-comparison").innerHTML = "<em><small><b class='text-danger'>" + (parseFloat(e.features[0].properties['mean_family_size']) - phMeanFamily).toFixed(2) +"</b>"+ " less than the <span><abbr title='4.493'>nat'l average</span>.</small></em>"
        }

        if (phGini > parseFloat(e.features[0].properties['gini'])){
            document.getElementById("gini-comparison").innerHTML =  "<em><small><b class='text-danger'>" + (phGini - parseFloat(e.features[0].properties['gini'])).toFixed(4) +"</b>"+ " more than the nat'l index.</small></em>"
        } else{
            document.getElementById("gini-comparison").innerHTML = "<em><small><b class='text-success'>" + (parseFloat(e.features[0].properties['gini']) - phGini).toFixed(4) +"</b>"+ " less than the national index.</small></em>"
        }

        
    });
    map.on('mousemove', 'fies', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features.length > 0) {
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
    
  // svg element
      
    const svg = d3.select('div#barContainer2')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('border', 'solid 1px #fff');
    const chart = svg.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${margin.l},${margin.t})`);
          // axes areas
    const xAxis = svg.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${margin.l},${height-margin.b})`);
    const yAxis = svg.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${margin.l},${margin.t})`);
    
    const svg2 = d3.select('div#barContainer')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('border', 'solid 1px #fff');
    
    const chart2 = svg2.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${margin.l},${margin.t})`);
          // axes areas
    const xAxis2 = svg2.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${margin.l},${height-margin.b})`);
    const yAxis2 = svg2.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${margin.l},${margin.t})`);
      
    const svg3 = d3.select('div#barContainer3')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('border', 'solid 1px #fff');
    const chart3 = svg3.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${margin.l},${margin.t})`);
          // axes areas
    const xAxis3 = svg3.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${margin.l},${height-margin.b})`);
    const yAxis3 = svg3.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${margin.l},${margin.t})`);
    
    const svg4 = d3.select('div#barContainer4')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('border', 'solid 1px #fff');
    
    const chart4 = svg4.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${margin.l},${margin.t})`);
          // axes areas
    const xAxis4 = svg4.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${margin.l},${height-margin.b})`);
    const yAxis4 = svg4.append('g')
        .classed('axis', true)
        .attr('transform', `translate(${margin.l},${margin.t})`);
    
    

  // datasets
  let dataRegion = [{key: 'Food', value: 12},{key: 'Clothes', value: 12},
               {key: 'Household', value: 12},{key: 'Health', value: 12},
               {key: 'Fuel', value: 12},{key: 'Communication', value: 12},
               {key: 'Transportation', value: 12},{key: 'Education', value: 12},
               {key: 'Recreation', value: 12},{key: 'Miscellany', value: 12},
               {key: 'Furniture', value: 12},{key: 'Rent', value: 12},
                {key: 'Occasions', value: 12},{key: 'Other', value: 12}];
  let dataRegionIncome = [{key: 'Regular Income', value: 12},{key: 'Seasonal Income', value: 12},
                       {key: 'Entrepreneurial Income', value: 12},{key: 'Other Sources of Income', value: 12},
                       {key: 'Support From Abroad', value: 12},{key: 'Support From Domestic Sources', value: 12}];
    updateData(dataRegion, chart2, xAxis2, yAxis2);
    updateData(dataRegionIncome, chart3, xAxis3, yAxis3);
  var data = d3.csv("https://raw.githubusercontent.com/carlraymundo/DATA101-Final-Project/diego/data/aggdata.csv?token=AGC4UAD46DLLI2NWNAIN3S3BJH24G",
  function(d) {
    return {
      region: d.REGION,
      mean_expenditure: d.mean_expenditure,
      mean_income: d.mean_income,
    };
  }).then(function(dataset) {
      // transitions
      let sorted = dataset
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

    //   var color = d3.scaleSequential().domain([0, maxRatio]).interpolator(d3.interpolateGreens);

      bars.merge(barsEnter)
          .transition(tPosition)
          .attr('y', d=>yScale(d.region))
          .attr('height', yScale.bandwidth())
          .transition(tSize)
          .attr('width', d=>xScale(d.mean_expenditure))
          .style("fill", d => region_color(d.region));
      // class reset
      setTimeout(()=>{bars.merge(barsEnter).classed('new', false)}, d*4)
  });
    
  var data2 = d3.csv("https://raw.githubusercontent.com/carlraymundo/DATA101-Final-Project/diego/data/aggdata.csv?token=AGC4UAD46DLLI2NWNAIN3S3BJH24G",
  function(d) {
    return {
      region: d.REGION,
      mean_income: d.mean_income,
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
      console.log(d3.max(dataset, function(d) { return d.mean_income; }));
      let xScale = d3.scaleLinear()
          .domain([0, d3.max(dataset, d=>d.mean_income)])
          .range([0, width-margin.l-margin.r]);
      let yScale = d3.scaleBand()
          .domain(regions)
          .range([0, height-margin.t-margin.b])
          .padding(0.2);
      // axes
      d3.axisBottom(xScale)(xAxis4.transition(tSize));
      d3.axisLeft(yScale)(yAxis4.transition(tPosition));
      // update pattern
      // initial selection
      bars = chart4.selectAll('rect.bar');

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

    //   var color = d3.scaleSequential().domain([0, maxRatio]).interpolator(d3.interpolateGreens);

      bars.merge(barsEnter)
          .transition(tPosition)
          .attr('y', d=>yScale(d.region))
          .attr('height', yScale.bandwidth())
          .transition(tSize)
          .attr('width', d=>xScale(d.mean_income))
          .style("fill", d => region_color(d.region));
      // class reset
      setTimeout(()=>{bars.merge(barsEnter).classed('new', false)}, d*4)
  });
    
  // chart area
  // update function
  function updateData(dataset, chartF ,xAxisF, yAxisF){
      // transitions
      //console.log('qwe');
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
    //   let exp_color = d3.scaleSequential().domain([0, d3.max(dataset, d=>d.value)]).interpolator(d3.interpolateYlGn);
      let xScale = d3.scaleLinear()
          .domain([0, d3.max(dataset, d=>d.value)])
          .range([0, width-margin.l-margin.r]);
      let yScale = d3.scaleBand()
          .domain(categs)
          .range([0, height-margin.t-margin.b])
          .padding(0.2);
      // axes
      d3.axisBottom(xScale)(xAxisF.transition(tSize));
      d3.axisLeft(yScale)(yAxisF.transition(tPosition));
      // update pattern
      // initial selection
      bars = chartF.selectAll('rect.bar');
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
          .attr('width', d=>xScale(d.value))
          .style("fill", d => exp_color(d.key))
      // class reset
      setTimeout(()=>{bars.merge(barsEnter).classed('new', false)}, d*4)
  }

  //setTimeout(()=>{updateData1(data1)}, 2000)
  //setTimeout(()=>{updateData1(data2)}, 6000)
});