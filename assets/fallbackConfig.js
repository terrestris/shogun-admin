var shogunApplicationConfig = {
  appPrefix: '',
  path: {
    base: 'http://localhost:8080',
    swagger: '/shogun-boot/v2/api-docs',
    user: '/shogun-boot/users',
    layer: '/shogun-boot/layers',
    imageFile: '/shogun-boot/imagefiles',
    application: '/shogun-boot/applications',
    appInfo: '/shogun-boot/info/app',
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      isSessionValid: '/auth/isSessionValid'
    },
    keycloak: {
      base: 'http://localhost:8000/auth',
      realm: 'SpringBootKeycloak',
      clientId: 'shogun-app'
    },
    loggers: '/actuator/loggers',
    logfile: '/actuator/logfile',
    logo: null,
    metrics: '/actuator/metrics'
  },
  models: [
    'Layer',
    'Application',
    'User'
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
        visible: true
      },
      layers: {
        visible: true
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
      logs: {
        visible: true
      }
    }
  }
};
