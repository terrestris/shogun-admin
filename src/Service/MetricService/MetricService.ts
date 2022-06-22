import Logger from '../../Logger';

import Keycloak from 'keycloak-js';

import { getBearerTokenHeader } from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';

import config from 'shogunApplicationConfig';

export type Statistic = {
  statistic: string;
  value: number | string;
};

export type Tag = {
  tag: string;
  values: string[];
};

export type BaseUnit = 'seconds' | 'events' | 'threads' | 'bytes';

export type Metric = {
  name: string;
  description: string;
  baseUnit: BaseUnit;
  measurements: Statistic[];
  availableTags: Tag[];
};

export type MetricServiceOpts = {
  keycloak?: Keycloak;
};

class MetricService {

  private keycloak?: Keycloak;

  constructor(opts?: MetricServiceOpts) {
    this.keycloak = opts.keycloak;
  }

  async getMetric(type: string): Promise<Metric> {
    try {
      const response = await fetch(`${config.path.shogunBase}actuator/metrics/${type}`, {
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        }
      });
      const responseJson: Metric = await response.json();

      return responseJson;
    } catch (error) {
      Logger.error(`Error while reading the metric: ${error}`);

      return null;
    }
  };

}

export default MetricService;
