import React, { PropTypes } from 'react';

import SimpleRedux from './SimpleRedux';

const App = ({ overlays }) => (
  <div>
    <div style={{ margin: 10, float: 'left' }}>
      <SimpleRedux overlays={overlays} />
    </div>
  </div>
);

App.propTypes = {
  overlays: PropTypes.array.isRequired,
};

export default App;
