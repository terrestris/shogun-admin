import BaseEntity from '../../Model/BaseEntity';
import GenericService from './GenericService';

export class GenericServiceImpl extends GenericService<BaseEntity> {
  constructor(endpoint: string) {
    super(BaseEntity, endpoint);
  }
};
