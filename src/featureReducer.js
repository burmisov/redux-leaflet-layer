import {
  REDUXLAYER_SET_FEATURE_COORDS,
  REDUXLAYER_SET_FEATURE_PROPERTIES,
  REDUXLAYER_MOUSE_OVER_FEATURE,
  REDUXLAYER_MOUSE_OUT_FEATURE,
  REDUXLAYER_MOUSE_DOWN_FEATURE,
  REDUXLAYER_MOUSE_UP_FEATURE,
} from './actionTypes';

export default function featureReducer(state, action) {
  switch (action.type) {
    case REDUXLAYER_SET_FEATURE_COORDS:
      return state.updateIn(
        ['geometry', 'coordinates'],
        coords => coords.withMutations(c => {
          c.set(0, action.coords[0]);
          c.set(1, action.coords[1]);
        })
      );

    case REDUXLAYER_SET_FEATURE_PROPERTIES:
      return state.update('properties', props => props.merge(action.properties));

    case REDUXLAYER_MOUSE_OVER_FEATURE:
      return state.set('isMoseOver', true);

    case REDUXLAYER_MOUSE_OUT_FEATURE:
      return state.set('isMoseOver', false);

    case REDUXLAYER_MOUSE_DOWN_FEATURE:
      return state.set('isMouseDown', true);

    case REDUXLAYER_MOUSE_UP_FEATURE:
      return state.set('isMouseDown', false);

    default:
      return state;
  }
}
