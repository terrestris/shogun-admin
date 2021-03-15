import React, {
  ReactNode,
} from 'react';

import moment from 'moment';

import MetricEntry, { MetricEntryProps } from '../MetricEntry/MetricEntry';

interface ProcessUptimeProps extends Omit<MetricEntryProps, 'type'> { };

export const ProcessUptime: React.FC<ProcessUptimeProps> = ({
  ...passThroughProps
}) => {

  const valueRenderer = (value: number | string): ReactNode => {
    let val = moment.utc(Number(value) * 1000).format('HH:mm:ss');

    return <span>{val}</span>;
  }

  const suffixRenderer = () => {
    return <span>HH:mm:ss</span>;
  };

  return (
    <MetricEntry
      type="process.uptime"
      valueRenderer={valueRenderer}
      suffixRenderer={suffixRenderer}
      {...passThroughProps}
    />
  );
};

export default ProcessUptime;
