import GenericService from '../GenericService/GenericService';
import User from '../../Model/User';

import config from 'shogunApplicationConfig';
import ImageFile from '../../Model/ImageFile';
import { keycloak } from '../../Util/KeyCloakUtil';

class ImageFileService extends GenericService<ImageFile> {

  constructor() {
    super(User, config.path.imageFile);
  }

  getFile(uuid: string | number): Promise<ImageFile> {
    if (!keycloak.token) {
      return Promise.reject('No keycloak token available.');
    }
    const reqOpts = {
      method: 'GET',
      headers: this.getDefaultHeaders()
    };

    return fetch(`${this.basePath}/${uuid}`, reqOpts)
      .then(this.isSuccessOne.bind(this));
  }

}

export default ImageFileService;
