import GenericService from '../GenericService/GenericService';
import Layer from '../../Model/Layer';

class LayerService extends GenericService<Layer> {

  constructor(endPoint: string) {
    super(Layer, endPoint);
  }

}

export default LayerService;
