import GenericService from '../GenericService/GenericService';
import Application from '../../Model/Application';

class ApplicationService extends GenericService<Application> {

  constructor(endPoint: string) {
    super(Application, endPoint);
  }

}

export default ApplicationService;
