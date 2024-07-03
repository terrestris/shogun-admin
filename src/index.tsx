import './index.less';

import React, { Suspense } from 'react';

import { loader } from '@monaco-editor/react';

import {
  // eslint-disable-next-line camelcase
  __federation_method_setRemote,
  // eslint-disable-next-line camelcase
  __federation_method_getRemote
  // @ts-ignore
} from '__federation__';

import { Button, Result } from 'antd';
import Logger from 'js-logger';
import Keycloak from 'keycloak-js';
import _isNil from 'lodash/isNil';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import config from 'shogunApplicationConfig';

import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

import { PluginProvider } from './Context/PluginContext';
import { SHOGunAPIClientProvider } from './Context/SHOGunAPIClientContext';
import i18n from './i18n';
import { AdminPluginInternal } from './plugin';

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

const loadPluginModules = async (moduleName: string, moduleUrl: string, remoteNames: string[]) => {
  __federation_method_setRemote(moduleName, {
    url: moduleUrl,
    format: 'esm',
    from: 'vite'
  });

  const modules = [];
  for (const remoteName of remoteNames) {
    const module = await __federation_method_getRemote(moduleName, remoteName);
    modules.push(module);
  }

  return modules;
};

const loadPlugins = async (client: SHOGunAPIClient) => {
  if (!config.plugins || config.plugins.length === 0) {
    Logger.info('No plugins found');
    return [];
  }

  Logger.info('Loading plugins');

  const clientPlugins: AdminPluginInternal [] = [];

  for (const plugin of config.plugins) {
    const name = plugin.name;
    const resourcePath = plugin.resourcePath;
    const exposedPaths = plugin.exposedPaths;

    if (!name) {
      Logger.error('Required plugin configuration \'name\' is not set');
      return clientPlugins;
    }

    if (!resourcePath) {
      Logger.error('Required plugin configuration \'resourcePath\' is not set');
      return clientPlugins;
    }

    if (!exposedPaths) {
      Logger.error('Required plugin configuration \'exposedPaths\' is not set');
      return clientPlugins;
    }

    Logger.info(`Loading plugin ${name} (with exposed paths ${exposedPaths.join(' and ')}) from ${resourcePath}`);

    let adminPluginModules: any[];
    try {
      adminPluginModules = await loadPluginModules(name, resourcePath, exposedPaths);

      Logger.info(`Successfully loaded plugin ${name}`);
    } catch (error) {
      Logger.error(`Could not load plugin ${name}:`, error);
      return clientPlugins;
    }

    adminPluginModules.forEach(module => {
      const adminPluginDefault: AdminPluginInternal = module.default;
      const PluginComponent = adminPluginDefault.component;

      const WrappedPluginComponent = () => (
        <PluginComponent
          client={client}
          t={i18n.t}
        />
      );

      adminPluginDefault.wrappedComponent = WrappedPluginComponent;

      if (adminPluginDefault.i18n) {
        Object.entries(adminPluginDefault.i18n).forEach(locale => {
          const lng = locale[0];
          const resources = locale[1].translation;
          i18n.addResourceBundle(lng, 'translation', resources, true, true);
        });
      }

      clientPlugins.push(adminPluginDefault);
    });
  }

  return clientPlugins;
};

const renderApp = async () => {
  const rootElement = document.getElementById('root');
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

    const plugins = await loadPlugins(client);

    loader.config({
      paths: {
        vs: './vs'
      }
    });

    root.render(
      <SHOGunAPIClientProvider client={client}>
        <PluginProvider plugins={plugins}>
          <RecoilRoot>
            <Suspense>
              <App />
            </Suspense>
          </RecoilRoot>
        </PluginProvider>
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
