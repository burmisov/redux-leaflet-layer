import React, { Component, PropTypes } from 'react';
import { Lmap } from 'react-redux-leaflet';
import { Map } from 'immutable';
import L from 'leaflet';

import ShowMapStore from './ShowMapStore';
import ShowReduxLayerStore from './ShowReduxLayerStore';
import LayerControl from './LayerControl';

class SimpleRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRLstore: true,
    };
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState({
      showRLstore: !this.state.showRLstore,
    });
  }

  render() {
    return (
      <div>
        <div style={{ float: 'left' }}>
          <div style={{ width: 300, height: 600 }}>
            <Lmap
              lmapId="simpleRedux"
              defaultCenter={new Map({ x: 44, y: 56 })}
              defaultZoom={5}
              defaultLayers={
                [
                  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
                ].concat(this.props.overlays)
              }
            />
          </div>
          <LayerControl />
        </div>
        <div style={{ width: 300, float: 'left', marginLeft: 10 }}>
          <h5>Redux store state for current map:</h5>
          <ShowMapStore lmapId="simpleRedux" />
        </div>
        <div style={{ width: 300, float: 'left', marginLeft: 10 }}>
          <h5>Redux store state for redux layer:</h5>
          <button onClick={this.handleToggleClick}>
            Toggle store display
          </button>
          {
            this.state.showRLstore ?
              <ShowReduxLayerStore layerId="myReduxLayer" /> :
              null
          }
        </div>
      </div>
    );
  }
}

SimpleRedux.propTypes = {
  overlays: PropTypes.array.isRequired,
};

export default SimpleRedux;
