import {
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

import featureReducer from './featureReducer';

export default function singleLayerReducer(state, action) {
  switch (action.type) {
    case REDUXLAYER_ADD_FEATURES:
      return state.get('features').merge(action.features);

    case REDUXLAYER_REMOVE_FEATURES:
      return state.update(
        'features', features => features.withMutations(features => {
          action.featureIds.forEach(featureId => features.delete(featureId));
        })
      );

    case REDUXLAYER_CLEAR_FEATURES:
      return state.update('features', features => features.clear());

    case REDUXLAYER_SET_FILTER:
      return state
        .set('filterExpression', action.filterExpression)
        .update('features', features => features.withMutations(features => {
          action.featureMaskChanges.forEach(change => {
            features.setIn([change.featureId, 'isShown'], change.mask);
          });
        }))
      ;

    case REDUXLAYER_SET_FEATURE_COORDS: /* falls through */
    case REDUXLAYER_SET_FEATURE_PROPERTIES: /* falls through */
    case REDUXLAYER_MOUSE_OVER_FEATURE: /* falls through */
    case REDUXLAYER_MOUSE_OUT_FEATURE: /* falls through */
    case REDUXLAYER_MOUSE_DOWN_FEATURE: /* falls through */
    case REDUXLAYER_MOUSE_UP_FEATURE:
      return state.updateIn(
        ['features', action.featureId],
        feature => featureReducer(feature, action)
      );

    default:
      return state;
  }
}
