require('./index.html');
require('leaflet/dist/leaflet.css');
require('leaflet/dist/images/marker-icon.png');
require('leaflet/dist/images/marker-icon-2x.png');
require('leaflet/dist/images/marker-shadow.png');
const L = require('leaflet');
L.Icon.Default.imagePath = './';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux-immutablejs';
import { reducers as lmapReducers } from 'react-redux-leaflet';

import { ReduxLayer, reducers as reduxLayerReducers } from '../../src';
import App from './App';

const simpleReduxStore = createStore(combineReducers(
  Object.assign(
    {},
    lmapReducers,
    reduxLayerReducers
  )
));

const myReduxLayer = ReduxLayer.createReduxLayer({
  layerId: 'myReduxLayer',
  /* markerOptions, */
  getFeatureId: feature => feature.properties.id,
  dispatch: simpleReduxStore.dispatch,
});

ReactDOM.render(
  <Provider store={simpleReduxStore}>
    <App overlays={[myReduxLayer.leafletLayer]} />
  </Provider>,
  document.getElementById('root')
);
