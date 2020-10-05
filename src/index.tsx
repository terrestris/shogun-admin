import React from 'react';
import ReactDOM from 'react-dom';

// import { Provider } from 'react-redux';

import App from './App';

import './index.less';
import KeyCloakUtil from './Util/KeyCloakUtil';

// KeyCloakUtil
//   .init()
//   .then(() => {
    ReactDOM.render(
      // <Provider store={store}>
        <App />,
      // </Provider>,
      document.getElementById('app')
    );
  // });
