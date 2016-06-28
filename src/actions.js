import {
  REDUXLAYER_LAYER_CREATED,
  REDUXLAYER_LAYER_REMOVED,

  REDUXLAYER_ADD_FEATURES,
  REDUXLAYER_REMOVE_FEATURES,
  REDUXLAYER_CLEAR_FEATURES,
  REDUXLAYER_SET_FILTER,

  REDUXLAYER_SET_FEATURE_COORDS,
  REDUXLAYER_SET_FEATURE_PROPERTIES,
  REDUXLAYER_MOUSE_OVER_FEATURE,
  REDUXLAYER_MOUSE_OUT_FEATURE,
  REDUXLAYER_MOUSE_DOWN_FEATURE,
  REDUXLAYER_MOUSE_UP_FEATURE,
} from './actionTypes';

import * as ReduxLayer from './ReduxLayer';

export const layerCreated = (layerId, options) => ({
  type: REDUXLAYER_LAYER_CREATED,
  layerId,
  options,
});

export const layerRemoved = layerId => ({
  type: REDUXLAYER_LAYER_REMOVED,
  layerId,
});

export const addFeatures = (layerId, features) => {
  const newFeatures = ReduxLayer.addFeatures(layerId, features);
  return {
    type: REDUXLAYER_ADD_FEATURES,
    layerId,
    features: newFeatures,
  };
};

export const removeFeatures = (layerId, featureIds) => {
  ReduxLayer.removeFeatures(layerId, featureIds);
  return {
    type: REDUXLAYER_REMOVE_FEATURES,
    layerId,
    featureIds,
  };
};

export const clearFeatures = layerId => {
  ReduxLayer.clearFeatures(layerId);
  return {
    type: REDUXLAYER_CLEAR_FEATURES,
  };
};

export const setFilter = (layerId, filterExpression) => {
  const featureMaskChanges = ReduxLayer.setFilter(layerId, filterExpression);
  return {
    type: REDUXLAYER_SET_FILTER,
    filterExpression,
    featureMaskChanges,
  };
};

export const setFeatureCoords = (layerId, featureId, coords) => {
  ReduxLayer.setFeatureCoords(layerId, featureId, coords);
  return {
    type: REDUXLAYER_SET_FEATURE_COORDS,
    featureId,
    coords,
  };
};

export const setFeatureProperties = (layerId, featureId, properties) => {
  ReduxLayer.setFeatureProperties(layerId, featureId, properties);
  return {
    type: REDUXLAYER_SET_FEATURE_PROPERTIES,
    featureId,
    properties,
  };
};

export const mouseOverFeature = (layerId, featureId) => ({
  type: REDUXLAYER_MOUSE_OVER_FEATURE,
  layerId,
  featureId,
});

export const mouseOutFeature = (layerId, featureId) => ({
  type: REDUXLAYER_MOUSE_OUT_FEATURE,
  layerId,
  featureId,
});

export const mouseDownFeature = (layerId, featureId) => ({
  type: REDUXLAYER_MOUSE_DOWN_FEATURE,
  layerId,
  featureId,
});

export const mouseUpFeature = (layerId, featureId) => ({
  type: REDUXLAYER_MOUSE_UP_FEATURE,
  layerId,
  featureId,
});
