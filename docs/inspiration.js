import { ReduxLayer } from './ReduxLayer';
import { reduxLayerNss } from './ReduxLayer/nss';

const myLayer = new ReduxLayer({
  id: 'myLayer-id',
  style: feature => ({
    color: feature.properties.color,
    opacity: feature.properties.active ? 1.0 : 0.5,
  }),
  pointToLayer: feature => L.marker(feature.properties.geometry),
  getFeatureId: feature => feature.properties._id,
  filter: feature => true,
  onEachFeature: (feauture, layer) => { layer.bindPopup(/***/); },
});

myLayer.createLeafletLayer().addTo(map);

myLayer.addData(/* Some GeoJSON */);

reduxLayerNss['myLayer-id'][featureId].setLatLng(/**/);

///////
import {
  setFeatureGeometry,
  setFeatureProperties,
  addFeatures,
  removeFeatures,
  clearFeatures,
  setZIndex,
  bringToFront,
  bringToBack,
} from 'ReduxLayer/actions';

setFeatureGeometry('myLayer-id', 'someFeatureId', [56, 44]);
setFeatureProperties('myLayer-id', 'someFeatureId', { color: 'red', active: true });
addFeatures('myLayer-id', /* geoJson featureCollection OR array of features */);
removeFeatures('myLayer-id', ['featureId1', 'featureId2']);
