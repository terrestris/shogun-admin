import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import {
  ReactKeycloakProvider
} from '@react-keycloak/web';

import Keycloak from 'keycloak-js';

import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

const App = React.lazy(() => import('./App'));

import config from 'shogunApplicationConfig';

import './index.less';
import Logger from './Logger';
import { SHOGunClientProvider } from './Context/SHOGunClientContext';
import { Result } from 'antd';

const initKeycloak = async (): Promise<Keycloak | undefined> => {
  const keycloakEnabled = config.security.keycloak.enabled;
  const keycloakHost = config.security.keycloak.base;
  const keycloakRealm = config.security.keycloak.realm;
  const keycloakClientId = config.security.keycloak.clientId;

  if (!keycloakEnabled) {
    Logger.info('Not using the keycloak adapter');
    return undefined;
  }

  if (!keycloakHost) {
    throw new Error('Config key security.keycloak.base is not set');
  }

  if (!keycloakRealm) {
    throw new Error('Config key security.keycloak.realm is not set');
  }

  if (!keycloakClientId) {
    throw new Error('Config key security.keycloak.clientId is not set');
  }

  const keycloak = new Keycloak({
    url: keycloakHost,
    realm: keycloakRealm,
    clientId: keycloakClientId
  });

  keycloak.onTokenExpired = async () => {
    try {
      await keycloak.updateToken(0);
    } catch (error) {
      Logger.error('Error while refreshing the access token: ', error);
    }
  };

  await keycloak.init({
    onLoad: 'login-required'
  });

  return keycloak;
};

const initSHOGunClient = (keycloak?: Keycloak) => {
  const client = new SHOGunAPIClient({
    url: config.path.shogunBase || '/',
    keycloak: keycloak
  });

  return client;
};

const renderApp = async () => {
  const root = createRoot(document.getElementById('app'));

  try {
    const keycloak = await initKeycloak();

    const client = initSHOGunClient(keycloak);

    root.render(
      <SHOGunClientProvider client={client}>
        <ReactKeycloakProvider authClient={keycloak}>
          <RecoilRoot>
            <Suspense>
              <App />
            </Suspense>
          </RecoilRoot>
        </ReactKeycloakProvider>
      </SHOGunClientProvider>
    );
  } catch (error) {
    Logger.error(error);

    root.render(
      <Result
        status="warning"
        title="Failed to load the application. Check your console."
      />
    );
  }
};

renderApp();
