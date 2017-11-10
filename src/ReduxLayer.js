import L from 'leaflet';
import nss from './nss';
import {
  mouseOverFeature,
  mouseOutFeature,
  mouseDownFeature,
  mouseUpFeature,
  layerCreated,
  layerRemoved,
} from './actions';

function defaultFilter(/* feature */) {
  return true;
}

function defaultStyle(/* feature */) {
  return {};
}

function defaultMarkerOptions(/* feature */) {
  return {
    icon: new L.Icon.Default(),
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
  layer.on('mouseover', () => { dispatch(mouseOverFeature(layerId, featureId)); });
  layer.on('mouseout', () => { dispatch(mouseOutFeature(layerId, featureId)); });
  layer.on('mousedown', () => { dispatch(mouseDownFeature(layerId, featureId)); });
  layer.on('mouseup', () => { dispatch(mouseUpFeature(layerId, featureId)); });
}

/**
 * Creates a new Redux Layer in nss and fires an appropriate create action.
 * @param {object} options
 * @param {string} options.layerId - New Id for layer to be created [required]
 * @param {function} dispatch - Redux store dispatch function [required]
 * @param {function} options.style - Path style function (see below)
 * @param {function} options.markerOptions - Marker options function (see below)
 * @param {object} options.globalMarkerOptions - 'Static' options applied to all markers
 * @param {function} options.getFeatureId - Gets a feature object and returns an Id string.
 * @param {function} options.onEachFeature - This is executed after feature creation
 * @param {boolean} options.trackMouseEvents - Weather you want mouseover/out/up/down
 *                                             autochanges in Redux store
 *
 * style function signature is:
 * (feature) => { <must return a Leaflet path style object> }
 * markerOptions signature is:
 * (feature) => { <must return a Leaflet marker options object> }
 */
export function createReduxLayer({
  layerId, dispatch, style, markerOptions, globalMarkerOptions,
  getFeatureId, onEachFeature, trackMouseEvents, passingProps,
}) {
  if (nss[layerId]) {
    throw new Error(`Trying to create redux layer with id=${layerId}, which already exists`);
  }

  nss[layerId] = {
    leafletLayer: L.layerGroup(),
    features: {},
    layers: {},
    filterMask: {},
    filter: defaultFilter,
    filterExpression: 'true',
    passingProps: passingProps || [],
    style: style || defaultStyle,
    markerOptions: markerOptions || defaultMarkerOptions,
    globalMarkerOptions: globalMarkerOptions || defaultGlobalMarkerOptions,
    getFeatureId: getFeatureId || defaultGetFeatureId,
    onEachFeature: onEachFeature || defaultOnEachFeature,
    dispatch,
    trackMouseEvents,
  };

  dispatch(layerCreated(layerId, { filterExpression: nss[layerId].filterExpression }));

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
    filter, filterMask, leafletLayer, features, onEachFeature, dispatch,
    trackMouseEvents, passingProps,
  } = nss[layerId];

  const newFeatures = {};
  featuresToAdd.forEach(feature => {
    const featureId = getFeatureId(feature);
    let newMarkerOptions;
    if (feature.geometry.type === 'Point') {
      newMarkerOptions = markerOptions(feature);
      layers[featureId] = L.marker(
        L.GeoJSON.coordsToLatLng(feature.geometry.coordinates),
        Object.assign({}, globalMarkerOptions, newMarkerOptions)
      );
    } else {
      layers[featureId] = L.geoJSON(feature, { style });
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

    passingProps.forEach(propName => {
      if (feature.hasOwnProperty(propName)) {
        newFeature[propName] = feature[propName];
      }
    });

    let featureWithMarkerOptions;
    if (newMarkerOptions) {
      featureWithMarkerOptions = { ...newFeature, markerOptions: newMarkerOptions };
    }
    features[featureId] = featureWithMarkerOptions || newFeature;
    newFeatures[featureId] = newFeature;

    onEachFeature(newFeature, layers[featureId]);

    if (dispatch && trackMouseEvents) {
      layerEventsToActions(layers[featureId], layerId, featureId);
    }
  });

  return newFeatures;
}

export function removeFeatures(layerId, featureIds) {
  const { filterMask, leafletLayer, layers, features } = nss[layerId];
  featureIds.forEach(featureId => {
    if (filterMask[featureId]) {
      leafletLayer.removeLayer(layers[featureId]);
    }
    delete layers[featureId];
    delete filterMask[featureId];
    delete features[featureId];
  });
}

export function clearFeatures(layerId) {
  removeFeatures(layerId, Object.keys(nss[layerId].layers));
}

export function setFeatureCoords(layerId, featureId, coords) {
  const { features, layers } = nss[layerId];
  features[featureId].geometry.coordinates = coords;
  if (features[featureId].geometry.type === 'Point') {
    layers[featureId].setLatLng(L.GeoJSON.coordsToLatLng(coords));
  } else {
    layers[featureId].setLatLngs(L.GeoJSON.coordsToLatLngs(coords));
  }
}

export function setFeatureParams(layerId, featureId, feature) {
  const {
    features, layers, style, markerOptions, filter, leafletLayer,
  } = nss[layerId];

  Object.assign(features[featureId].properties, feature.properties);
  nss[layerId].passingProps.forEach((passName) => {
    if (feature[passName]) {
      switch (typeof(features[featureId][passName])) {
        case ('string'):
          features[featureId][passName] = feature[passName];
          break;
        case ('number'):
          features[featureId][passName] = feature[passName];
          break;
        case ('array'):
          features[featureId][passName] = [].concat(feature[passName]);
          break;
        case ('undefined'):
          break;
        default:
          Object.assign(features[featureId][passName], feature[passName]);
          break;
      }
    }
  });

  let maskChange;
  const filterResult = filter(features[featureId]);
  if (!filterResult && features[featureId].isShown) {
    layers[featureId].remove();
    features[featureId].isShown = false;
    maskChange = false;
  }

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

  if (filterResult && !features[featureId].isShown) {
    leafletLayer.addLayer(layers[featureId]);
    features[featureId].isShown = true;
    maskChange = true;
  }

  return maskChange;
}

export function setFeatureProperties(layerId, featureId, properties) {
  const {
    features, layers, style, markerOptions, filter, leafletLayer,
  } = nss[layerId];
  Object.assign(features[featureId].properties, properties);

  let maskChange;
  const filterResult = filter(features[featureId]);
  if (!filterResult && features[featureId].isShown) {
    layers[featureId].remove();
    features[featureId].isShown = false;
    maskChange = false;
  }

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

  if (filterResult && !features[featureId].isShown) {
    leafletLayer.addLayer(layers[featureId]);
    features[featureId].isShown = true;
    maskChange = true;
  }

  return maskChange;
}

export function setFilter(layerId, filterExpression) {
  const { features, layers, leafletLayer, filterMask } = nss[layerId];
  const oldFilterExpression = nss[layerId].filterExpression;
  const featureMaskChanges = [];
  if (filterExpression !== oldFilterExpression) {
    nss[layerId].filterExpression = filterExpression;
    /* eslint-disable no-new-func */
    const filter = new Function('feature', `return ${filterExpression}`);
    nss[layerId].filter = filter;
    Object.keys(features).forEach(featureId => {
      const filterResult = filter(nss[layerId].features[featureId]);
      if (filterResult && features[featureId].isShown) {
        return;
      }
      if (!filterResult && !features[featureId].isShown) {
        return;
      }
      if (filterResult && !features[featureId].isShown) {
        filterMask[featureId] = true;
        leafletLayer.addLayer(layers[featureId]);
        features[featureId].isShown = true;
        featureMaskChanges.push({ featureId, mask: true });
      }
      if (!filterResult && features[featureId].isShown) {
        filterMask[featureId] = false;
        layers[featureId].remove();
        features[featureId].isShown = false;
        featureMaskChanges.push({ featureId, mask: false });
      }
    });
  }

  return featureMaskChanges;
}

export function removeReduxLayer(layerId) {
  clearFeatures(layerId);
  nss[layerId].dispatch(layerRemoved(layerId));
  delete nss[layerId];
}
