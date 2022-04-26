import GenericService from '../GenericService/GenericService';
import User from '../../Model/User';
import SecurityUtil from '../../Util/SecurityUtil';

import config from 'shogunApplicationConfig';
import Logger from 'js-logger';

class UserService extends GenericService<User> {

  constructor(endPoint: string) {
    super(User, endPoint);
  }

  static userIsLoggedIn = async () => {
    try {
      const response = await fetch(config?.path?.auth?.isSessionValid);
      return response.ok;
    } catch (error) {
      Logger.error('Could not check session validity.');
      return false;
    }
  };

  static logout = async (): Promise<string | void> => {
    if (config?.path?.auth?.logout) {
      let requestCfg: RequestInit = {
        credentials: 'same-origin',
        method: 'POST',
        headers: SecurityUtil.getSecurityHeaders(config)
      };
      const response = await fetch(config.path.auth.logout, requestCfg);
      if (response.ok) {
        if (response.url) {
          window.location.href = response.url;
        } else {
          window.location.reload();
        }
      }
    } else {
      return Promise.reject('Logout is currently not possible.');
    }
  }

}

export default UserService;
