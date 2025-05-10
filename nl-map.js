import {getCenter} from 'ol/extent';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {WMTS} from 'ol/source';
import {Projection} from 'ol/proj';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Fill, Stroke, Style} from "ol/style";
import {GeoJSON} from "ol/format";
import GML32 from "ol/format/GML32";

export default class NlMap {

    #target;
    #map;

    constructor(target) {
        this.#target = target;
    }

    initMap() {
        if (this.#map) {
            this.#map.dispose();
        }
        const extent = this.#getProjectionExtent();
        this.#createMap(extent);
        this.#map.getView().fit(extent);
    }

    #createMap(extent) {
        this.#map = new Map({
            target: this.#target,
            layers: [this.#createBaseLayer()],
            view: new View({
                constrainResolution: true,
                extent: extent,
                showFullExtent: true,
                center: getCenter(extent),
                projection: this.#getProjection(),
                resolutions: this.#getResolutions(),
                zoom: 1,
            }),
        });
    }

    #createBaseLayer() {
        return new TileLayer({
            source: new WMTS({
                url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?',
                layer: 'standaard',
                format: 'image/png',
                projection: 'EPSG:28992',
                tileGrid: this.#getTileGridWMTS(),
                style: 'default',
                matrixSet: 'EPSG:28992',
            }),
        });
    }

    addGeoJsonLayer(geojson) {
        const layer = this.#createVectorLayer();
        const formatter = new GeoJSON();
        const features = formatter.readFeatures(geojson, {
            featureProjection: this.#map.getView().getProjection(),
            dataProjection: this.#map.getView().getProjection(),
        });
        console.log(features.length + ' GeoJSON features');
        layer.getSource().addFeatures(features);
        this.#map.addLayer(layer);
        this.#zoomToFit(features, layer);
    }

    addGMLLayer(gml) {
        const layer = this.#createVectorLayer();
        const formatter = new GML32();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(gml, 'text/xml');
        const features = formatter.readFeatures(xmlDoc, {
            featureProjection: this.#map.getView().getProjection(),
            dataProjection: this.#map.getView().getProjection(),
        });

        console.log(features.length + ' GML features');
        layer.getSource().addFeatures(features);
        this.#map.addLayer(layer);
        this.#zoomToFit(features, layer);
    }

    #createVectorLayer() {
        const source = new VectorSource();
        return new VectorLayer({
            source: source,
            style: this.#createVectorStyle()
        });
    }

    #createVectorStyle() {
        return new Style({
            fill: new Fill({
                // is the same as 852fb2, but with opacity
                color: 'rgba(133, 47, 178, 0.4)'
            }),
            stroke: new Stroke({
                color: '#852fb2',
                width: 2
            }),
        });
    }

    #zoomToFit(features, layer) {
        // Zoom to the extent of the features
        if (features.length > 0) {
            this.#map.getView().fit(layer.getSource().getExtent(), {
                padding: [50, 50, 50, 50],
                duration: 1000
            });
        } else {
            console.warn('No features found in the GML file');
        }
    }

    #getProjection() {
        return new Projection({
            code: 'EPSG:28992',
            units: 'm',
            extent: this.#getProjectionExtent(),
            getPointResolution: (resolution) => resolution
        });
    }

    #getProjectionExtent() {
        return [-285401.92, 22598.08, 595401.92, 903401.92];
    }

    #getResolutions() {
        return [
            3440.64, 1720.32, 860.169, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44,
            6.72, 3.36, 1.68, 0.84, 0.42, 0.21, 0.105, 0.0525
        ];
    }

    #getMatrixIds() {
        return [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
        ];
    }

    #getTileGridWMTS() {
        return new WMTSTileGrid({
            extent: this.#getProjectionExtent(),
            resolutions: this.#getResolutions(),
            matrixIds: this.#getMatrixIds(),
        });
    }

}
