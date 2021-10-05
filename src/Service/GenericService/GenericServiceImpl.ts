import BaseEntity from '../../Model/BaseEntity';
import GenericService from './GenericService';
import config from 'shogunApplicationConfig';

export class GenericServiceImpl extends GenericService<BaseEntity> {
  constructor(endpoint: string) {
    super(BaseEntity, `${config.appPrefix}/${endpoint}`);
  }
};
