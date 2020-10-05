import { Moment } from 'moment';

export interface BaseEntityArgs {
  id?: string;
  created?: Moment;
  modified?: Moment;
}

export default class BaseEntity {
  id?: string;
  created?: Moment;
  modified?: Moment;

  constructor({id, created, modified}: BaseEntityArgs) {
    this.id = id;
    this.created = created;
    this.modified = modified;
  }
}
