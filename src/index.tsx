import 'ol/ol.css';
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

// import {
//   AdminPluginInternal
// } from './plugin';

// import { PluginProvider } from './Context/PluginContext';
// import OlFeature from 'ol/Feature';

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

// ExamplePlugin: 'ExamplePlugin@/client-plugin/remoteEntry.js'
// const loadPluginModules = async (moduleName: string, moduleUrl: string, remoteNames: string[]) => {
//   await __webpack_init_sharing__('default');

//   await new Promise<void>((resolve, reject) => {
//     const element = document.createElement('script');

//     element.src = moduleUrl;
//     element.type = 'text/javascript';
//     element.async = true;

//     element.onload = () => {
//       element.parentElement?.removeChild(element);
//       resolve();
//     };

//     element.onerror = (err) => {
//       element.parentElement?.removeChild(element);
//       reject(err);
//     };

//     document.head.appendChild(element);
//   });

//   // @ts-ignore
//   const container = window[moduleName];

//   // eslint-disable-next-line camelcase
//   await container.init(__webpack_share_scopes__.default);

//   const modules = [];
//   for (const remoteName of remoteNames) {
//     const factory = await container.get(remoteName);
//     const module = factory();
//     modules.push(module);
//   }

//   return modules;
// };

// const loadPlugins = async () => {
//   if (!config.plugins || config.plugins.length === 0) {
//     console.info('No plugins found');
//     return [];
//   }

//   console.info('Loading plugins');

//   const clientPlugins: AdminPluginInternal[] = [];

//   for (const plugin of config.plugins) {
//     const name = plugin.name;
//     const resourcePath = plugin.resourcePath;
//     const exposedPaths = plugin.exposedPaths;

//     if (!name) {
//       console.error('Required plugin configuration \'name\' is not set');
//       return clientPlugins;
//     }

//     if (!resourcePath) {
//       console.error('Required plugin configuration \'resourcePath\' is not set');
//       return clientPlugins;
//     }

//     if (!exposedPaths) {
//       console.error('Required plugin configuration \'exposedPaths\' is not set');
//       return clientPlugins;
//     }

//     console.info(`Loading plugin ${name} (with exposed paths ${exposedPaths.join(' and ')}) from ${resourcePath}`);

//     let clientPluginModules: any[];
//     try {
//       clientPluginModules = await loadPluginModules(name, resourcePath, exposedPaths);
//       console.info(`Successfully loaded plugin ${name}`);
//     } catch (error) {
//       console.error(`Could not load plugin ${name}:`, error);
//       return clientPlugins;
//     }

//     for (let module of clientPluginModules) {
//       const clientPluginDefault: AdminPluginInternal = module.default;
//       const PluginComponent = clientPluginDefault.component;

//       // if (toolConfig) {
//       //   const pluginApplicationConfig = toolConfig.find((tc) => tc.name === clientPluginDefault.key);
//       //   if (pluginApplicationConfig?.config?.disabled) {
//       //     Logger.info(`"${clientPluginDefault.key}" is disabled by the application config`);
//       //     continue;
//       //   }
//       // }

//       const WrappedPluginComponent = () => (
//         <PluginComponent
//           // feature={new OlFeature()}
//           // map={map}
//           // client={client}
//         />
//       );

//       clientPluginDefault.wrappedComponent = WrappedPluginComponent;

//       if (clientPluginDefault.i18n) {
//         Object.entries(clientPluginDefault.i18n).forEach(locale => {
//           const lng = locale[0];
//           const resources = locale[1].translation;
//           i18n.addResourceBundle(lng, 'translation', resources, true, true);
//         });
//       }

//       // if (clientPluginDefault.reducers) {
//       //   const reducers = createReducer(clientPluginDefault.reducers);
//       //   store.replaceReducer(reducers);
//       // }

//       // if (Array.isArray(clientPluginDefault.middlewares)) {
//       //   clientPluginDefault.middlewares?.forEach(mw => dynamicMiddleware.addMiddleware(mw));
//       // }

//       clientPlugins.push(clientPluginDefault);
//     }
//   }

//   return clientPlugins;
// };

const renderApp = async () => {
  const rootElement = document.getElementById('app');

  if (_isNil(rootElement)) {
    // TODO Logger is not working?!
    Logger.error('element not found');
    return;
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

    // const plugins = await loadPlugins();

    // loader.config({
    //   paths: {
    //     vs: './vs'
    //   }
    // });

    root.render(
      <SHOGunAPIClientProvider client={client}>
        {/*<PluginProvider plugins={plugins}>*/}
          <RecoilRoot>
            <Suspense>
              <App />
            </Suspense>
          </RecoilRoot>
        {/*</PluginProvider>*/}
      </SHOGunAPIClientProvider>
    );
  } catch (error) {
    Logger.error(error);

    if ((error as Error).message === 'UNAUTHORIZED') {
      root.render(
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
