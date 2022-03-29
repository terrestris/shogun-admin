import GenericService from '../GenericService/GenericService';
import User from '../../Model/User';

import config from 'shogunApplicationConfig';
import ImageFile from '../../Model/ImageFile';

class ImageFileService extends GenericService<ImageFile> {

  constructor() {
    super(User, config.path.imageFile);
  }

  getFile(uuid: string | number): Promise<ImageFile> {
    const reqOpts = {
      method: 'GET',
      headers: this.getDefaultHeaders()
    };

    return fetch(`${this.basePath}/${uuid}`, reqOpts)
      .then(this.isSuccessOne.bind(this));
  }

}

export default ImageFileService;
