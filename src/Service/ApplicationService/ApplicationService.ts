import GenericService from '../GenericService/GenericService';

import config from 'shogunApplicationConfig';
import Application from '../../Model/Application';

class ApplicationService extends GenericService<Application> {

  constructor() {
    super(Application, config.path.application);
  }

}

export default ApplicationService;
