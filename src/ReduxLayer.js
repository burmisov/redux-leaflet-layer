import L from 'leaflet';
import nss from './reduxLayersNss';
import {
  mouseOverFeature,
  mouseOutFeature,
  mouseDownFeature,
  mouseUpFeature,
} from './actions';

function defaultFilter(/* feature */) {
  return true;
}

function defaultStyle(/* feature */) {
  return {};
}

function defaultMarkerOptions(feature) {
  return {
    icon: L.Icon.Default(),
    opacity: 1.0,
    zIndexOffset: 0,
  };
}

const defaultGlobalMarkerOptions = {};

function defaultGetFeatureId(/* feature */) {
  return Math.random().toString(36).substring(7);
}

function defaultOnEachFeature(/* feature, layer */) {
  /* no action */
}

function layerEventsToActions(layer, layerId, featureId) {
  const { dispatch } = nss[layerId];
  layer.on('mouseover', dispatch(mouseOverFeature(layerId, featureId)));
  layer.on('mouseout', dispatch(mouseOutFeature(layerId, featureId)));
  layer.on('mousedown', dispatch(mouseDownFeature(layerId, featureId)));
  layer.on('mouseup', dispatch(mouseUpFeature(layerId, featureId)));
}

export function createReduxLayer({
  layerId, style, markerOptions, globalMarkerOptions,
  getFeatureId, onEachFeature, dispatch
}) {
  if (nss[layerId]) {
    throw new Error(`Trying to create redux layer with id=${layerId}, which already exists`);
  }

  this.layerId = layerId;

  nss[this.layerId] = {
    leafletLayer: L.layerGroup(),
    features: {},
    layers: {},
    filterMask: {},
    filter: defaultFilter,
    filterExpression: 'true',
    style: style || defaultStyle,
    markerOptions: markerOptions || defaultMarkerOptions,
    globalMarkerOptions: globalMarkerOptions || defaultGlobalMarkerOptions,
    getFeatureId: getFeatureId || defaultGetFeatureId,
    onEachFeature: onEachFeature || defaultOnEachFeature,
    dispatch: this.dispatch,
  };

  return nss[layerId];
}

export function addFeatures(layerId, arrayOrFeatureCollection) {
  let featuresToAdd;
  if (!arrayOrFeatureCollection) {
    throw new Error('addFeatures must be supplied with an array or featureCollection object');
  } else if (Array.isArray(arrayOrFeatureCollection)) {
    featuresToAdd = arrayOrFeatureCollection;
  } else if (arrayOrFeatureCollection.type === 'FeatureCollection') {
    featuresToAdd = arrayOrFeatureCollection.features;
  } else {
    throw new Error('addFeatures must be supplied with an array or featureCollection object');
  }

  const {
    layers, markerOptions, globalMarkerOptions, getFeatureId, style,
    filter, filterMask, leafletLayer, features, onEachFeature, dispatch
  } = nss[layerId];

  const processedFeatures = {};
  featuresToAdd.forEach(feature => {
    const featureId = getFeatureId(feature);
    let newMarkerOptions;
    if (feature.geometry.type === 'Point') {
      newMarkerOptions = markerOptions(feature);
      layers[featureId] = L.marker(
        L.geoJson.coordsToLatLng,
        Object.assign({}, globalMarkerOptions, newMarkerOptions);
      );]
    } else {
      layers[featureId] = L.geoJson.geometryToLayer(feature, { style });
    }
    filterMask[featureId] = filter(feature);
    if (filterMask[featureId]) {
      leafletLayer.addLayer(layers[featureId]);
    }
    const newFeature = {
      geometry: feature.geometry,
      properties: feature.properties,
      isShown: Boolean(filterMask[featureId]),
    };
    if (newMarkerOptions) {
      newFeature.markerOptions = newMarkerOptions;
    }
    features[featureId] = newFeature;
    newFeatures[featureId] = newFeature;

    onEachFeature(newFeature, layers[featureId]);

    if (dispatch) {
      layerEventsToActions(layers[featureId]);
    }
  });

  return newFeatures;
}

export function removeFeatures(layerId, featureIds) {
  const { filterMask, leafletLayer, layers } = nss[layerId];
  featureIds.forEach(featureId => {
    if (filterMask[featureId]) {
      leafletLayer.removeLayer(layers[featureId]);
    }
    delete layers[featureId];
  });
}

export function clearFeatures(layerId) {
  removeFeatures(layerId, Object.keys(nss[layerId].layers));
}

export function setFeatureCoords(layerId, featureId, coords) {
  const { features, layers } = nss[layerId];
  features[featureId].geometry.coordinates = coords;
  if (features[featureId].geometry.type === 'Point') {
    layers[featureId].setLatLng(L.geoJson.coordsToLatLng(coords));
  } else {
    layers[featureId].setLatLngs(L.geoJson.coordsToLatLngs(coords));
  }
}

export function setFeatureProperties(layerId, featureId, properties) {
  const { features, layers, style, pointToLayer, markerOptions } = nss[layerId];
  Object.assign(features[featureId].properties, properties);
  if (features[featureId].geometry.type === 'Point') {
    const oldMarkerOptions = features[featureId].markerOptions;
    const newMarkerOptions = markerOptions(features[featureId]);
    const layer = layers[featureId];
    if (newMarkerOptions.icon !== oldMarkerOptions.icon) {
      layer.setIcon(newMarkerOptions.icon);
    }
    if (newMarkerOptions.opacity !== oldMarkerOptions.opacity) {
      layer.setOpacity(newMarkerOptions.opacity);
    }
    if (newMarkerOptions.zIndexOffset !== oldMarkerOptions.zIndexOffset) {
      layer.setZIndexOffset(newMarkerOptions.zIndexOffset);
    }
  } else {
    layers[featureId].setStyle(style(features[featureId]));
  }
}

export function setFilter(layerId, filterExpression) {
  const { features, layers, leafletLayer } = nss[layerId];
  const oldFilterExpression = nss[layerId].filterExpression;
  let featureMaskChanges = [];
  if (filterExpression !== oldFilterExpression) {
    const filter = new Function('geom, props', 'return ' + filterExpression);
    nss[layerId].filter = filter;
    Object.keys(features).forEach(featureId) => {
      const filterResult = filter(feature.geometry, feature.properties);
      if (filterResult && features[featureId].isShown) {
        return;
      }
      if (!filterResult && !features[featuresId].isShown) {
        return;
      }
      if (filterResult && !features[featureId].isShown) {
        leafletLayer.addLayer(layers[featureId]);
        features[featureId].isShown = true;
        featureMaskChanges.push({ featureId, mask: true });
      }
      if (!filterResult && features[featureId].isShown) {
        layers[featureId].remove();
        features[featureId].isShown = false;
        featureMaskChanges.push({ featureId, mask: false });
      }
    });
  }

  return featureMaskChanges;
}
