import GenericService from '../GenericService/GenericService';
import User from '../../Model/User';

import config from 'shogunApplicationConfig';

class UserService extends GenericService<User> {

  constructor() {
    super(User, config.path.user);
  }

  static logout(): Promise<string> {
    return Promise.reject('Logout is currently not possible.');
  }

}

export default UserService;
