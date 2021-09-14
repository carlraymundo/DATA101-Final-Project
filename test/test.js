mapboxgl.accessToken =
  "pk.eyJ1IjoicGFzaWgiLCJhIjoiY2pybzJqdTVjMHJzeDQ0bW80aGdzaXV3ayJ9.yxD8Nqu7FLnf8-lBo7F1zQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/pasih/cjrzhm5uw2r061fpfhze1444i",
  center: [24.532232, 65.517973],
  zoom: 3.8,
  pitchWithRotate: false,
  dragRotate: false
});

map.touchZoomRotate.disableRotation();

let scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
});
map.addControl(scale,'bottom-right');
scale.setUnit('metric');

function createMarkupFrom(data) {
  return `
<h1 class="name">${data.Name}</h1>
<h2 class="population">Population</h2>
<div class="populationchart" style="grid-template-columns: ${data.vaesto_p}% 1fr;">
    <div class="darkgray"></div>
    <div class="lightgray populationnumber">${data.vaesto}<small> (${data.vaesto_p} %)</small></div>
</div>
<h2 class="gender">Gender distribution (%)</h2>
<div class="genderchart" style="grid-template-columns: ${data.miehet_p}% ${data.naiset_p}%;">
    <div class="darkgray distributionnumber">${data.miehet_p}</div>
    <div class="lightgray distributionnumber">${data.naiset_p}</div>
</div>
<div class="genderlegend"><span style="text-align:left;">Male</span><span style="text-align:right;">Female</span></div>
<h2 class="age">Age distribution (%)</h2>
<div class="agechart" style="grid-template-columns: ${data.ika_0_14p}% ${data.ika_15_64p}% ${data.ika_65_p}%;">
    <div class="darkgray distributionnumber">${data.ika_0_14p}</div>
    <div class="gray distributionnumber">${data.ika_15_64p}</div>
    <div class="lightgray distributionnumber">${data.ika_65_p}</div>
</div>
<div class="agelegend"><span style="text-align:left;">0-14</span><span style="text-align:center;">15-64</span><span style="text-align:right;">65-</span></div>
<p class="footer">Data: Statistics Finland, Population by Municipality 2017</p>
`;
}

map.on("mousemove", function(e) {
  let features = map.queryRenderedFeatures(e.point, { layers: ['population_by_region', 'population_by_municipality'] });
  let vectorTileData = features[0].properties;
  document.getElementById("side").innerHTML = createMarkupFrom(vectorTileData);
});

map.on("mousemove", "population_by_region", function(e) {
  let feature = e.features[0];
  map.setFilter("region_highlight", [
    "all",
    ["match", ["get", "Name"], [feature.properties.Name], true, false]
  ]);
});

map.on("mouseleave", "population_by_region", function() {
  map.setFilter("region_highlight", [
    "all",
    ["match", ["get", "Name"], "", true, false]
  ]);
});

map.on("mousemove", "population_by_municipality", function(e) {
  var feature = e.features[0];
  map.setFilter("municipality_highlight", [
    "all",
    ["match", ["get", "Name"], [feature.properties.Name], true, false]
  ]);
});

map.on("mouseleave", "population_by_municipality", function() {
  map.setFilter("municipality_highlight", [
    "all",
    ["match", ["get", "Name"], "", true, false]
  ]);
});

const initialData = {
  Name: "Uusimaa",
  ika_0_14: "277390",
  ika_0_14p: 16.8,
  ika_15_64: "1095449",
  ika_15_64p: 66.2,
  ika_65_: "282785",
  ika_65_p: 17.1,
  miehet: "806972",
  miehet_p: 48.7,
  naiset: "848652",
  naiset_p: 51.3,
  vaesto: "1655624",
  vaesto_p: 30
};

map.onLoad = document.getElementById("side").innerHTML = createMarkupFrom(
  initialData
);
