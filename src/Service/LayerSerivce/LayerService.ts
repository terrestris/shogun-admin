import GenericService from '../GenericService/GenericService';

import config from 'shogunApplicationConfig';
import { keycloak } from '../../Util/KeyCloakUtil';
import { KeycloakPromise } from 'keycloak-js';
import Layer from '../../Model/Layer';

class LayerService extends GenericService<Layer> {

  constructor() {
    super(Layer, config.path.layer);
  }

  static logout(): KeycloakPromise<void, void> {
    return keycloak.logout();
  }

}

export default LayerService;
