import React, { PropTypes } from 'react';
import { actionCreators } from '../../src';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

const {
  addFeatures, clearFeatures,
  setFeatureCoords, setFeatureProperties,
} = actionCreators;

function createMarker() {
  return {
    geometry: {
      type: 'Point',
      coordinates: [56 - 5 + 10 * Math.random(), 44 - 5 + 10 * Math.random()],
    },
    properties: {
      id: `point_${Math.random().toString(36).substring(7)}`,
      speedLat: Math.random() * 0.02 - 0.01,
      speedLon: Math.random() * 0.02 - 0.01,
    },
  };
}

function createMarkers(num) {
  const result = [];
  for (let i = 0; i < num; i++) {
    result.push(createMarker());
  }
  return result;
}

function runMovement(dispatch, reduxLayer) {
  let start = null;
  function step(timestamp) {
    if (!start) { start = timestamp; }
    const progress = timestamp - start;

    reduxLayer.get('features').forEach((feature, featureId) => {
      dispatch(setFeatureCoords(
        'myReduxLayer', featureId,
        [
          feature.getIn(['geometry', 'coordinates', 0]) +
            feature.getIn(['properties', 'speedLon']) * progress / 10,
          feature.getIn(['geometry', 'coordinates', 1]) +
            feature.getIn(['properties', 'speedLat']) * progress / 10,
        ]
      ));
    });

    if (progress < 20000) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

function setRandomClasses(dispatch, reduxLayer) {
  reduxLayer.get('features').forEach((feature, featureId) => {
    dispatch(setFeatureProperties(
      'myReduxLayer', featureId,
      { class: Math.floor(Math.random() * 2) }
    ));
  });
}

const LayerControl = ({ dispatch, reduxLayers }) => (
  <div style={{ border: 'solid', borderColor: 'black', margin: 5, padding: 5 }}>
    <button
      onClick={() => dispatch(addFeatures('myReduxLayer', createMarkers(1)))}
    >
      Add marker
    </button>
    <button
      onClick={() => dispatch(addFeatures('myReduxLayer', createMarkers(10)))}
    >
      Add 10 markers
    </button>
    <button
      onClick={() => dispatch(addFeatures('myReduxLayer', createMarkers(100)))}
    >
      Add 100 markers
    </button>
    <button
      style={{ display: 'block ' }}
      onClick={() => dispatch(clearFeatures('myReduxLayer'))}
    >
      Clear markers
    </button>
    <button
      style={{ display: 'block ' }}
      onClick={() => { runMovement(dispatch, reduxLayers.get('myReduxLayer')); }}
    >
      Move markers
    </button>
    <button
      style={{ display: 'block ' }}
      onClick={() => { setRandomClasses(dispatch, reduxLayers.get('myReduxLayer')); }}
    >
      Set random class
    </button>
  </div>
);

LayerControl.propTypes = {
  dispatch: PropTypes.func.isRequired,
  reduxLayers: PropTypes.object,
};
const reduxLayersRootSelector = state => state.get('reduxLayers');
const reduxLayersSelector = createSelector(
  reduxLayersRootSelector,
  reduxLayers => ({ reduxLayers })
);

export default (connect(
  reduxLayersSelector, null, null, { pure: true }
))(LayerControl);
