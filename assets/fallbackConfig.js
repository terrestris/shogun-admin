var shogunApplicationConfig = {
  appPrefix: '/admin',
  defaultPageSize: 10,
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
    },
    tokenName: 'security-token'
  },
  geoserver: {
    base: '/geoserver',
    upload: {
      buttonVisible: false,
      workspace: 'SHOGUN',
      limit: 200000000 // ~200MB
    }
  },
  models: [
    'Application',
    'Layer',
    'User',
    'Group',
    'Role'
  ],
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
