declare module '*.png';
declare module '*.svg';
declare module '*.gif';

type Scope = unknown;
type Factory = () => any;
// eslint-disable-next-line @typescript-eslint/naming-convention, camelcase, no-underscore-dangle
declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
// eslint-disable-next-line @typescript-eslint/naming-convention, camelcase, no-underscore-dangle
declare const __webpack_share_scopes__: { default: Scope };

declare module 'shogunApplicationConfig' {
  interface PluginConfiguration {
    name?: string;
    resourcePath?: string;
    exposedPaths?: string[];
  }
  interface GeoServerConfiguration {
    base?: string;
    upload?: {
      buttonVisible?: boolean;
      workspace?: string;
      limit?: number;
    };
  }
  /**
   * Config object which contains the settings to adapt the admin client
   * to your application.
   */
  interface AdminConfiguration {
    /**
     * Geoserver configuration object.
     */
    geoserver?: GeoServerConfiguration;
    /**
     * The path to the admin client on your host, e.g. '/admin'
     */
    appPrefix: string;
    /**
     * The default page size in all entity tables, e.g. 20.
     */
    defaultPageSize?: number;
    /**
     * Configuration of paths relevant for the admin client.
     */
    path: {
      /**
       * The path to the model configs, e.g. '/admin/modelconfigs'
       */
      modelConfigs: string;
      /**
       * The path to the shogun entry point, e.g. '/'
       */
      shogunBase: string;
      /**
       * The path to the logo used by the admin client, e.g. '/logo_large.svg'
       * when served by the SHOGun backend.
       */
      logo: string;
    };
    /**
     * Configuration of admin plugins.
     */
    plugins?: PluginConfiguration[];
    /**
     * Security related configuration object
     */
    security: {
      tokenName?: string;
      /**
       * Keycloak configuration object
       */
      keycloak: {
        /**
         * Flag if the admin is used with keycloak.
         */
        enabled: boolean;
        /**
         * Host config used by keycloak-js. Mandatory if keycloak is
         * enabled, e.g. 'https://localhost/auth'
         */
        host?: string;
        /**
         * Realm config used by keycloak-js. Mandatory if keycloak is
         * enabled, e.g. 'SHOGunKeycloak'
         */
        realm?: string;
        /**
         * Client id config used by keycloak-js. Mandatory if keycloak is
         * enabled, e.g. 'shogun-admin'
         */
        clientId?: string;
        /**
         * Returns all authorized Roles, e.g. 'admin'.
         */
        authorizedRoles?: string[];
      };
    };
    /**
     * List of model names (camelcase) that should be maintainable in the admin client.
     * Make sure to cover these models with your configured modelConfigs endpoint.
     */
    models: string[];
    /**
     * Entity history configuration object.
    */
    entityHistory: {
      /**
       * Whether the entity history is enabled or not.
       */
      enabled: boolean;
    };
    /**
     * Dashboard configuration object.
     */
    dashboard: {
      /**
       * Configuration for statistics card.
       */
      statistics: {
        /**
         * Should the dashboard include the statistics card.
         */
        visible: boolean;
      };
      /**
       * Configuration for applications card.
       */
      applications: {
        /**
         * Should the dashboard include the applications card.
         */
        visible: boolean;
      };
      /**
       * Configuration for layers card.
       */
      layers: {
        /**
         * Should the dashboard include the layers card.
         */
        visible: boolean;
      };
      /**
       * Configuration for users card.
       */
      users: {
        /**
         * Should the dashboard include the users card.
         */
        visible: boolean;
      };
    };
    /**
     * Navigation configuration object.
     */
    navigation: {
      /**
       * Configuration for the general submenu.
       */
      general: {
        /**
         * Configuration for the general->imagefiles menu entry.
         */
        imagefiles: {
          /**
           * Should the menu include the general->imagefiles menu entry.
           */
          visible: boolean;
        };
      };
      /**
       * Configuration for the status submenu.
       */
      status: {
        /**
         * Configuration for the status->metrics menu entry.
         */
        metrics: {
          /**
           * Should the menu include the status->metrics menu entry.
           */
          visible: boolean;
        };
        /**
         * Configuration for the status->logs menu entry.
         */
        logs: {
          /**
           * Should the menu include the status->logs menu entry.
           */
          visible: boolean;
        };
      };
      /**
       * Configuration for the settings submenu.
       */
      settings: {
        /**
         * Configuration for the settings->global menu entry.
         */
        global: {
          /**
           * Should the menu include the settings->global menu entry.
           */
          visible: boolean;
        };
        /**
         * Configuration for the settings->logs menu entry.
         */
        logs: {
          /**
           * Should the menu include the settings->logs menu entry.
           */
          visible: boolean;
        };
        /**
         * Configuration for the settings->graphQL menu entry.
         */
        graphiql: {
          /**
           * Should the menu include the settings->graphQL menu entry.
           */
          visible: boolean;
        };
        /**
         * Configuration for the settings->swagger menu entry.
         */
        swagger: {
          /**
           * Should the menu include the settings->swagger menu entry.
           */
          visible: boolean;
        };
      };
    };
  }
  const config: AdminConfiguration;

  export default config;
}

declare const PROJECT_VERSION: string;

declare interface FormTranslations {
  de: Record<string, string>;
  en: Record<string, string>;
}

declare module 'monaco-editor/esm/vs/*?worker';
