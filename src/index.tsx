import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.less';
import Logger from './Logger';
import KeyCloakUtil from './Util/KeyCloakUtil';

KeyCloakUtil
  .init()
  .then(() => {
    ReactDOM.render(
      <App />,
      document.getElementById('app')
    );
  })
  .catch(() => {
    Logger.warn('SHOGun: Could not load keycloak data.');
    ReactDOM.render(
      <App />,
      document.getElementById('app')
    );
  });
