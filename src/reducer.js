import { Map, fromJS } from 'immutable';

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

import singleLayerReducer from './singleLayerReducer';

const defaultState = new Map();

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case REDUXLAYER_LAYER_CREATED:
      return state.set(
        action.layerId,
        fromJS(action.options).set('features', new Map())
      );

    case REDUXLAYER_LAYER_REMOVED:
      return state.remove(action.layerId);

    case REDUXLAYER_ADD_FEATURES: /* falls through */
    case REDUXLAYER_REMOVE_FEATURES: /* falls through */
    case REDUXLAYER_CLEAR_FEATURES: /* falls through */
    case REDUXLAYER_SET_FILTER: /* falls through */

    case REDUXLAYER_SET_FEATURE_COORDS: /* falls through */
    case REDUXLAYER_SET_FEATURE_PROPERTIES: /* falls through */
    case REDUXLAYER_MOUSE_OVER_FEATURE: /* falls through */
    case REDUXLAYER_MOUSE_OUT_FEATURE: /* falls through */
    case REDUXLAYER_MOUSE_DOWN_FEATURE: /* falls through */
    case REDUXLAYER_MOUSE_UP_FEATURE:
      return state.update(
        action.layerId, layer => singleLayerReducer(layer, action)
      );

    default:
      return state;
  }
}
