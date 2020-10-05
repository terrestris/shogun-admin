import BaseEntity, { BaseEntityArgs } from './BaseEntity';

export interface UserArgs extends BaseEntityArgs {
  username: string;
  email: string;
  password?: string;
  enabled?: boolean;
  details?: any;
  clientConfig?: any;
}

export default class User extends BaseEntity {
  username: string;
  email: string;
  password?: string;
  enabled?: boolean;
  details?: any;
  clientConfig?: any;

  constructor({id, created, modified, username, email, password, enabled, details, clientConfig}: UserArgs) {
    super({id, created, modified});

    this.username = username;
    this.email = email;
    this.password = password;
    this.enabled = enabled;
    this.details = details;
    this.clientConfig = clientConfig;
  }
}
