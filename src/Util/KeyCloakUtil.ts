import Keycloack from 'keycloak-js';
import shogunApplicationConfig from 'shogunApplicationConfig';

export const keycloak = Keycloack({
  url: shogunApplicationConfig.path.keycloak.url,
  realm: shogunApplicationConfig.path.keycloak.realm,
  clientId: shogunApplicationConfig.path.keycloak.clientId
});

export default class KeyCloakUtil {

  public static init = async() => {
    return keycloak.init({
      onLoad: 'login-required'
    });
  };

}
