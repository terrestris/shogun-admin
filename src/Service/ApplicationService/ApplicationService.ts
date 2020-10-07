import GenericService from '../GenericService/GenericService';
import User from '../../Model/User';

import config from 'shogunApplicationConfig';
import Application from '../../Model/Application';

class ApplicationService extends GenericService<Application> {

  constructor() {
    super(User, config.path.application);
  }

}

export default ApplicationService;
