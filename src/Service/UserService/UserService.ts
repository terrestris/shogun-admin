import GenericService from '../GenericService/GenericService';
import User from '../../Model/User';
import SecurityUtil from '../../Util/SecurityUtil';

import config from 'shogunApplicationConfig';

class UserService extends GenericService<User> {

  constructor() {
    super(User, config.path.user);
  }

  static logout(): Promise<string> | void {
    if (config?.path?.auth?.logout) {
      let requestCfg: RequestInit = {
        credentials: 'same-origin',
        method: 'POST',
        headers: SecurityUtil.getSecurityHeaders(config)
      };
      fetch(config?.path?.auth?.logout, requestCfg).then((response) => {
        if (response.url) {
          window.location.href = response.url;
        } else {
          window.location.reload();
        }
      });
    } else {
      return Promise.reject('Logout is currently not possible.');
    }
  }

}

export default UserService;
