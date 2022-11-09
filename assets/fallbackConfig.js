var shogunApplicationConfig = {
  appPrefix: '/admin',
  path: {
    modelConfigs: './formconfigs',
    shogunBase: '/',
    logo: null
  },
  security: {
    keycloak: {
      enabled: true,
      host: 'https://localhost/auth',
      realm: 'SpringBootKeycloak',
      clientId: 'shogun-admin',
      authorizedRoles: [
        'admin'
      ]
    }
  },
  models: [
    'Application',
    'Layer',
    'User',
    'Group'
  ],
  uploadLimits: {
    geotiff: 2000000, // 200Mb
  },
  dashboard: {
    news: {
      visible: true
    },
    statistics: {
      visible: false
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
