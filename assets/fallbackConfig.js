var shogunApplicationConfig = {
  path: {
    base: 'https://localhost:8080',
    swagger: '/shogun-boot/v2/api-docs',
    user: '/shogun-boot/users',
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
