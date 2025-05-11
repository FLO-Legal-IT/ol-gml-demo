# Display of GML from file

`sportterreinen-origin.gml` is the file as we received it. It doesn't get parsed well in open layers (0 features).
It doesn't show in Qgis either. I tried to use the featureNS and featureType options as mentioned in https://openlayers.org/en/latest/apidoc/module-ol_format_GML32-GML32.html but it was not exactly clear to me how to use them. At last I had no success with it.

`sportterreinen-1.gml` is the same file, but manually rewritten by me. I removed al the none <gml:>-elements, wrapped the whole thing in a FeatureCollection element and each wrapped each Surface element in a featureMember element. It was correctly parsed in Qgis. In openlayers, the features could be parsed, but incorrectly, on computing the extent of the layer, there would be an error message: `Cannot fit empty extent provided as 'geometry'`.

I Qgis, I made a conversion from `sportterreinen-1.gml` to geojson (see `sportterreinen.json`). This geojson file displays correctly in open layers.

Then I made `sportterreinen-2.gml` version in which I only changed the name of the Surface element to Polygon and remove some of the interior element below the Surface element. All features where parsed and even the extent of the layer could be computed correctly. The feature would not be shown however, it ended with error message `geometryRenderer is not a function`

`sportterreinen-1` failed in this [gml 3.2 validator](alidatie.geostandaarden.nl/etf-webapp/testruns/create-direct?testProjectId=8089ca7a-8722-3119-9ec9-661205a743f4) with the message " Geometry coordinates shall only be specified using the gml:posList element for gml:LinearRing."
So i made version sportterreinen-3 in which I replaced <<gml:coordinates> by <gml:posList>. That file validates in the aforementioned validator, but it does not work in open layers either.

# Convert gml to gejson.
A solution could be to convert gml to geojson on the fly. I found `https://www.npmjs.com/package/gml2geojson`, but it doesn't work with any of the abovementioned examples.
