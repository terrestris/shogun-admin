import GenericService from '../GenericService/GenericService';
import User from '../../Model/User';

import config from 'shogunApplicationConfig';
import { keycloak } from '../../Util/KeyCloakUtil';
import { KeycloakPromise } from 'keycloak-js';

class UserService extends GenericService<User> {

  constructor() {
    super(User, config.paths.user.base);
  }

  static logout(): KeycloakPromise<void, void> {
    return keycloak.logout();
  }

}

export default UserService;
