import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';

import App from './App';

import './index.less';
import Logger from './Logger';
import KeyCloakUtil from './Util/KeyCloakUtil';

KeyCloakUtil
  .init()
  .then(() => {
    ReactDOM.render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
      document.getElementById('app')
    );
  })
  .catch(() => {
    Logger.warn('SHOGun: Could not load keycloak data.');
    ReactDOM.render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
      document.getElementById('app')
    );
  });
