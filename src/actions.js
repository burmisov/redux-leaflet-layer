import {
  REDUXLAYER_MOUSE_OVER_FEATURE,
  REDUXLAYER_MOUSE_OUT_FEATURE,
  REDUXLAYER_MOUSE_DOWN_FEATURE,
  REDUXLAYER_MOUSE_UP_FEATURE,
} from './actionTypes';

import * as ReduxLayer from './ReduxLayer';

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
  const newFeatureMask = ReduxLayer.setFilter(layerId, filterExpression);
  return {
    type: REDUXLAYER_SET_FILTER,
    filterExpression,
    newFeatureMask,
  };
};
