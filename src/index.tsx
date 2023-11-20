import './index.less';

import React, { Suspense } from 'react';

import { loader } from '@monaco-editor/react';

import { Button, Result } from 'antd';
import Keycloak from 'keycloak-js';
import _isNil from 'lodash/isNil';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import config from 'shogunApplicationConfig';

import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

import { SHOGunAPIClientProvider } from './Context/SHOGunAPIClientContext';
import i18n from './i18n';
import Logger from './Logger';

const App = React.lazy(() => import('./App'));

const initKeycloak = async (): Promise<Keycloak | null> => {
  const keycloakEnabled = config.security.keycloak.enabled;
  const keycloakHost = config.security.keycloak.host;
  const keycloakRealm = config.security.keycloak.realm;
  const keycloakClientId = config.security.keycloak.clientId;

  if (!keycloakEnabled) {
    Logger.info('Not using the keycloak adapter');
    return null;
  }

  if (!keycloakHost) {
    throw new Error('Config key security.keycloak.host is not set');
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
    onLoad: 'login-required',
    checkLoginIframe: false
  });

  return keycloak;
};

const initSHOGunAPIClient = (keycloak?: Keycloak) => {
  return new SHOGunAPIClient({
    url: config.path.shogunBase || '/',
    keycloak: keycloak
  });
};

const renderApp = async () => {
  const rootElement = document.getElementById('app');
  if (_isNil(rootElement)) {
    return Promise.reject();
  }
  const root = createRoot(rootElement);
  let keycloak: Keycloak | undefined;

  try {
    keycloak = await initKeycloak() ?? undefined;

    // Only check for roles if keycloak is enabled.
    if (!_isNil(keycloak)) {
      const authorizedRoles: string[] = config.security.keycloak.authorizedRoles || [];
      const keycloakClientId: string | undefined = config.security.keycloak.clientId;

      const isAuthorized = authorizedRoles.some(role => keycloak!.hasResourceRole(role, keycloakClientId));

      if (!isAuthorized) {
        throw new Error('UNAUTHORIZED');
      }
    }

    const client = initSHOGunAPIClient(keycloak);

    loader.config({
      paths: {
        vs: './vs'
      }
    });

    root.render(
      <SHOGunAPIClientProvider client={client}>
        <RecoilRoot>
          <Suspense>
            <App />
          </Suspense>
        </RecoilRoot>
      </SHOGunAPIClientProvider>
    );
  } catch (error) {
    Logger.error(error);

    if ((error as Error).message === 'UNAUTHORIZED') {      root.render(
      <Result
        status={'403'}
        title={i18n.t('Index.unauthorizedTitle') as string}
        extra={
          <Button
            onClick={async () => {
              if (keycloak) {
                await keycloak.logout();
                await keycloak.login();
              }
            }}
          >
            {i18n.t('Index.backToLoginButtonText') as string}
          </Button>
        }
      />
    );
    } else {
      root.render(
        <Result
          status={'warning'}
          title={i18n.t('Index.errorTitle') as string}
        />
      );
    }
  }
};

renderApp();
