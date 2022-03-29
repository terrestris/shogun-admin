import Logger from '../../Logger';

import config from 'shogunApplicationConfig';

export type Statistic = {
  statistic: string;
  value: number | string
}

export type Tag = {
  tag: string;
  values: string[]
}

export type BaseUnit = 'seconds' | 'events' | 'threads' | 'bytes';

export type Metric = {
  name: string;
  description: string;
  baseUnit: BaseUnit;
  measurements: Statistic[];
  availableTags: Tag[];
};

class MetricService {

  constructor() {}

  async getMetric(type: string): Promise<Metric> {
    try {
      const response = await fetch(`${config.path.metrics}/${type}`);
      const responseJson: Metric = await response.json();

      return responseJson;
    } catch (error) {
      Logger.error(`Error while reading the metric: ${error}`);

      return null;
    }
  };

}

export default MetricService;
