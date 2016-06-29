import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

const ShowReduxLayerStore = ({ layerId, reduxLayers }) => (
  <pre>
    {JSON.stringify(reduxLayers.get(layerId), null, 2)}
  </pre>
);

ShowReduxLayerStore.propTypes = {
  layerId: PropTypes.string.isRequired,
  reduxLayers: ImmutablePropTypes.map.isRequired,
};

const reduxLayersRootSelector = state => state.get('reduxLayers');
const reduxLayersSelector = createSelector(
  reduxLayersRootSelector,
  reduxLayers => ({ reduxLayers })
);

export default (connect(
  reduxLayersSelector, null, null, { pure: true }
))(ShowReduxLayerStore);
