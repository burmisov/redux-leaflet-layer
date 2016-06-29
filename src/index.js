// Had to use commonJS syntax here to be able to make modules hot reloadable
// for ease of development.
// (see https://github.com/gaearon/react-hot-loader/issues/158)

import * as ReduxLayer from './ReduxLayer';
import * as actionCreators from './actions';
const reduxLayerNss = require('./nss').default;
const reducers = require('./reducers').default;

module.exports = {
  ReduxLayer,
  actionCreators,
  reduxLayerNss,
  reducers,
};
