import GenericService from '../GenericService/GenericService';

import config from 'shogunApplicationConfig';
import Layer from '../../Model/Layer';

class LayerService extends GenericService<Layer> {

  constructor() {
    super(Layer, config.path.layer);
  }

}

export default LayerService;
