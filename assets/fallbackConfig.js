var shogunApplicationConfig = {
  appPrefix: '',
  path: {
    base: 'http://localhost:8080',
    swagger: '/v2/api-docs',
    user: '/users',
    layer: '/layers',
    imageFile: '/imagefiles',
    application: '/applications',
    appInfo: '/info/app',
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      isSessionValid: '/auth/isSessionValid'
    },
    loggers: '/actuator/loggers',
    logfile: '/actuator/logfile',
    logo: null,
    metrics: '/actuator/metrics',
    evictCache: '/cache/evict'
  },
  models: [
    'Application'
  ],
  dashboard: {
    news: {
      visible: true
    },
    statistics: {
      visible: true
    },
    applications: {
      visible: true
    },
    layers: {
      visible: true
    },
    users: {
      visible: true
    }
  },
  navigation: {
    general: {
      applications: {
        visible: true,
        schemas: {
          clientConfig: 'ApplicationClientConfig',
          layerTree: 'LayerTree',
          layerConfig: 'LayerConfig'
        }
      },
      layers: {
        visible: true,
        schemas: {
          clientConfig: 'LayerClientConfig',
          sourceConfig: 'LayerSourceConfig',
          features: 'GeoJsonObject'
        }
      },
      users: {
        visible: true
      },
      imagefiles: {
        visible: true
      }
    },
    status: {
      metrics: {
        visible: true
      },
      logs: {
        visible: true
      }
    },
    settings: {
      global: {
        visible: true
      },
      logs: {
        visible: true
      }
    }
  }
};
