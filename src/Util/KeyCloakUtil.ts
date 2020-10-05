import Keycloack from 'keycloak-js';
import shogunApplicationConfig from 'shogunApplicationConfig';

export const keycloak = Keycloack({
  url: shogunApplicationConfig.paths.keycloak.url,
  realm: shogunApplicationConfig.paths.keycloak.realm,
  clientId: shogunApplicationConfig.paths.keycloak.clientId
});

export default class KeyCloakUtil {

  public static init = () => {
    return keycloak.init({
      onLoad: 'login-required'
    });
  };

}
