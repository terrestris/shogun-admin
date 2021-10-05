import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

import BaseEntity from '../../Model/BaseEntity';
import { keycloak } from '../../Util/KeyCloakUtil';

export type ReplacerFunction = (key: string, value: any) => any;

abstract class GenericService<T extends BaseEntity> {

  clazz: string;

  basePath: string;

  replacer: ReplacerFunction;

  constructor(x: new (...newArgs: any[]) => T, basePath: string, replacer?: ReplacerFunction) {
    this.clazz = x.name;
    this.basePath = basePath;
    this.replacer = replacer;
  }

  findAll(): Promise<T[]> {
    if (!keycloak.token) {
      return Promise.reject('No keycloak token available.');
    }
    const reqOpts = {
      method: 'GET',
      headers: this.getDefaultHeaders()
    };

    return fetch(`${this.basePath}`, reqOpts)
      .then(this.isSuccessList.bind(this));
  }

  findOne(id: string | number): Promise<T> {
    if (!keycloak.token) {
      return Promise.reject('No keycloak token available.');
    }
    const reqOpts = {
      method: 'GET',
      headers: this.getDefaultHeaders()
    };

    return fetch(`${this.basePath}/${id}`, reqOpts)
      .then(this.isSuccessOne.bind(this));
  }

  add(t: Partial<T>): Promise<T> {
    if (!keycloak.token) {
      return Promise.reject('No keycloak token available.');
    }
    const reqOpts = {
      method: 'POST',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify(t, this.replacer)
    };

    return fetch(`${this.basePath}`, reqOpts)
      .then(this.isSuccessOne.bind(this));
  }

  update(t: T): Promise<T> {
    if (!keycloak.token) {
      return Promise.reject('No keycloak token available.');
    }
    const reqOpts = {
      method: 'PUT',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify(t, this.replacer)
    };

    return fetch(`${this.basePath}/${t.id}`, reqOpts)
      .then(this.isSuccessOne.bind(this));
  }

  updatePartial(t: Partial<T>): Promise<T> {
    if (!keycloak.token) {
      return Promise.reject('No keycloak token available');
    }
    if (!t.id) {
      return Promise.reject('"id" is missing in the update values.');
    }
    const reqOpts = {
      method: 'PATCH',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify(t, this.replacer)
    };

    return fetch(`${this.basePath}/${t.id}`, reqOpts)
      .then(this.isSuccessOne.bind(this));
  }

  delete(id: string | number): Promise<T> {
    if (!keycloak.token) {
      return Promise.reject('No keycloak token available.');
    }
    const reqOpts = {
      method: 'DELETE',
      headers: this.getDefaultHeaders()
    };

    return fetch(`${this.basePath}/${id}`, reqOpts)
      .then(this.isSuccessOne.bind(this));
  }

  isSuccessOne(response: Response): Promise<T> {
    return this.isSuccessHandler(response);
  }

  isSuccessList(response: Response): Promise<T[]> {
    return this.isSuccessHandler(response);
  }

  isSuccessHandler(response: Response) {
    if (response.ok) {
      // No Data
      if (response.status === 204) {
        return Promise.resolve();
      }
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  getDefaultHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie(),
      'Authorization': `Bearer ${keycloak.token}`
    };
  }
}

export default GenericService;
