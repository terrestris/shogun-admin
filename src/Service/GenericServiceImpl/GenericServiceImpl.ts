import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import {
  GenericEntityServiceOpts,
  GenericEntityService
} from '@terrestris/shogun-util/dist/service/GenericEntityService';

export class GenericServiceImpl extends GenericEntityService<BaseEntity> {
  constructor(opts: GenericEntityServiceOpts) {
    super(opts);
  }
};
