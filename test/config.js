export default {
  paths: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      isSessionValid: '/auth/isSessionValid',
    },
    graphql: {
      base: '/graphql'
    },
    keycloak: {
      url: 'http://localhost:8000/auth',
      realm: 'SpringBootKeycloak',
      clientId: 'shogun-app'
    },
    address: {
      base: '/addresses'
    },
    facility: {
      base: '/facilities'
    },
    organization: {
      base: '/organizations'
    },
    locationcosttraits: {
      base: '/locationcosttraits'
    },
    locationcost: {
      base: '/locationcosts'
    },
    project: {
      base: '/projects'
    },
    transportations: {
      base: '/transportations'
    },
    transportationtemplates: {
      base: '/transportationtemplates'
    },
    transportationtraits: {
      base: '/transportationtraits'
    },
    transportationproperties: {
      base: '/transportationproperties'
    }
  }
};
