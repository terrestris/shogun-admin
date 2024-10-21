import Keycloak from 'keycloak-js';
import config from 'shogunApplicationConfig';

import { getBearerTokenHeader } from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';

import Logger from '../../Logger';

export interface Statistic {
  statistic: string;
  value: number | string;
}

export interface Tag {
  tag: string;
  values: string[];
}

export type BaseUnit = 'seconds' | 'events' | 'threads' | 'bytes';

export interface Metric {
  name: string;
  description: string;
  baseUnit: BaseUnit;
  measurements: Statistic[];
  availableTags: Tag[];
}

export interface MetricServiceOpts {
  keycloak?: Keycloak;
}

class MetricService {

  private keycloak?: Keycloak;

  constructor(opts?: MetricServiceOpts) {
    this.keycloak = opts?.keycloak;
  }

  async getMetric(type: string): Promise<Metric> {
    try {
      const response = await fetch(`${config.path.shogunBase}actuator/metrics/${type}`, {
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        }
      });
      return await response.json();
    } catch (error) {
      Logger.error(`Error while reading the metric: ${error}`);
      return Promise.reject();
    }
  };

}

export default MetricService;
