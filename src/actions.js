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

/**
 * Register layer creation (NOT SUPPOSED TO BE USED EXTERNALLY.
 * Use ReduxLayer.createReduxLayer instead)
 * @param {string} layerId - Redux layer Id string.
 * @param {object} options - Any options to put to store.
 */
export const layerCreated = (layerId, options) => ({
  type: REDUXLAYER_LAYER_CREATED,
  layerId,
  options,
});

/**
 * Register layer removal (SUPPOSED TO BE USED INTERNALLY ONLY.
 * Use ReduxLayer.removeReduxLayer instead)
 * @param {string} layerId - Redux layer Id string.
 * @param {object} options - Any options to put to store.
 */
export const layerRemoved = layerId => ({
  type: REDUXLAYER_LAYER_REMOVED,
  layerId,
});

/**
 * Add features to layer.
 * They will be automatically filtered & styled.
 * @param {string} layerId - Redux layer Id string.
 * @param {object|array} features - GeoJSON FeatureCollection OR array of features
 */
export const addFeatures = (layerId, features) => {
  const newFeatures = ReduxLayer.addFeatures(layerId, features);
  return {
    type: REDUXLAYER_ADD_FEATURES,
    layerId,
    features: newFeatures,
  };
};

/**
 * Remove features from layer.
 * @param {string} layerId - Redux layer Id string.
 * @param {array} featureIds - Array of featureIds to be removed
 */
export const removeFeatures = (layerId, featureIds) => {
  ReduxLayer.removeFeatures(layerId, featureIds);
  return {
    type: REDUXLAYER_REMOVE_FEATURES,
    layerId,
    featureIds,
  };
};

/**
 * Remove all features from layer.
 * @param {string} layerId - Redux layer Id string.
 */
export const clearFeatures = layerId => {
  ReduxLayer.clearFeatures(layerId);
  return {
    type: REDUXLAYER_CLEAR_FEATURES,
    layerId,
  };
};

/**
 * Set filter expression for layer.
 * @param {string} layerId - Redux layer Id string.
 * @param {string} filterExpression - filter expression.
 *
 * Filter function will be: (feature) => { return <filterExpression>; }
 * If function result is trueish, feature is supposed to be shown.
 */
export const setFilter = (layerId, filterExpression) => {
  const featureMaskChanges = ReduxLayer.setFilter(layerId, filterExpression);
  return {
    type: REDUXLAYER_SET_FILTER,
    layerId,
    filterExpression,
    featureMaskChanges,
  };
};

/**
 * Set feature coordinates.
 * @param {string} layerId - Redux layer Id string.
 * @param {string} featureId - Feature Id string.
 * @param {array} coords - GeoJSON coordinates.
 */
export const setFeatureCoords = (layerId, featureId, coords) => {
  ReduxLayer.setFeatureCoords(layerId, featureId, coords);
  return {
    type: REDUXLAYER_SET_FEATURE_COORDS,
    layerId,
    featureId,
    coords,
  };
};

/**
 * Set feature properties.
 * @param {string} layerId - Redux layer Id string.
 * @param {string} featureId - Feature Id string.
 * @param {array} properties - new properties to be merged with the old ones.
 */
export const setFeatureProperties = (layerId, featureId, properties) => {
  const maskChange = ReduxLayer.setFeatureProperties(
    layerId, featureId, properties
  );
  return {
    type: REDUXLAYER_SET_FEATURE_PROPERTIES,
    layerId,
    featureId,
    properties,
    maskChange,
  };
};

/**
 * Register mouse over feature. (NOT SUPPOSED TO BE USED EXTERNALLY)
 * @param {string} layerId - Redux layer Id string.
 * @param {string} featureId - Feature Id string.
 */
export const mouseOverFeature = (layerId, featureId) => ({
  type: REDUXLAYER_MOUSE_OVER_FEATURE,
  layerId,
  featureId,
});

/**
 * Register mouse not over feature. (NOT SUPPOSED TO BE USED EXTERNALLY)
 * @param {string} layerId - Redux layer Id string.
 * @param {string} featureId - Feature Id string.
 */
export const mouseOutFeature = (layerId, featureId) => ({
  type: REDUXLAYER_MOUSE_OUT_FEATURE,
  layerId,
  featureId,
});

/**
 * Register mouse down on feature. (NOT SUPPOSED TO BE USED EXTERNALLY)
 * @param {string} layerId - Redux layer Id string.
 * @param {string} featureId - Feature Id string.
 */
export const mouseDownFeature = (layerId, featureId) => ({
  type: REDUXLAYER_MOUSE_DOWN_FEATURE,
  layerId,
  featureId,
});

/**
 * Register mouse up from feature. (NOT SUPPOSED TO BE USED EXTERNALLY)
 * @param {string} layerId - Redux layer Id string.
 * @param {string} featureId - Feature Id string.
 */
export const mouseUpFeature = (layerId, featureId) => ({
  type: REDUXLAYER_MOUSE_UP_FEATURE,
  layerId,
  featureId,
});
