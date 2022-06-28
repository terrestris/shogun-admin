import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import GenericService, { GenericServiceOpts } from '@terrestris/shogun-util/dist/service/GenericService';

export class GenericServiceImpl extends GenericService<BaseEntity> {
  constructor(opts: GenericServiceOpts) {
    super(opts);
  }
};
