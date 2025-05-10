import NlMap from './nl-map';
import {parseGML} from 'gml2geojson';
// see https://v2.vitejs.dev/guide/assets.html
import geoJSON from './sportterreinen.json?raw';
import gml from './sportterreinen-2.gml?raw';
// import gml from './sportterreinen-1.gml?raw';
// import gml from './sportterreinen-origin.gml?raw';

const geoJsonMap = new NlMap('map_geojson');
const gmlMap = new NlMap('map_gml');
const gmlToGeoJsonMap = new NlMap('map_gml_to_geojson');

async function loadLayers() {
    geoJsonMap.addGeoJsonLayer(geoJSON);
    gmlMap.addGMLLayer(gml);
    const geoJsonFromGml = parseGML(gml);
    gmlToGeoJsonMap.addGeoJsonLayer(geoJsonFromGml);
}

geoJsonMap.initMap();
gmlMap.initMap();
gmlToGeoJsonMap.initMap();

loadLayers().then().catch(err => console.log(err));

