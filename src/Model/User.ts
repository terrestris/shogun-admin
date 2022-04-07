import BaseEntity, { BaseEntityArgs } from './BaseEntity';

export interface UserArgs extends BaseEntityArgs {
  providerDetails?: any;
  clientConfig?: any;
  details?: any;
}

export default class User extends BaseEntity {
  providerDetails?: any;
  details?: any;
  clientConfig?: any;

  constructor({id, created, modified, details, clientConfig, providerDetails}: UserArgs) {
    super({
      id,
      created,
      modified
    });

    this.details = details;
    this.clientConfig = clientConfig;
    this.providerDetails = providerDetails;
  }
}
