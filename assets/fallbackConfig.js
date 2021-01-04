var shogunApplicationConfig = {
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
    }
  },
  models: [
    'Layer',
    'Application',
    'User'
  ]
};
