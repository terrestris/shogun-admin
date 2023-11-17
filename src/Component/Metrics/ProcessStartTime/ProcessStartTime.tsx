import moment from 'moment';
import React, {
  ReactNode,
} from 'react';

import MetricEntry, { MetricEntryProps } from '../MetricEntry/MetricEntry';

interface ProcessStartTimeProps extends Omit<MetricEntryProps, 'type'> { };

export const ProcessStartTime: React.FC<ProcessStartTimeProps> = ({
  ...passThroughProps
}) => {

  const valueRenderer = (value: number | string): ReactNode => {
    let val = moment(Number(value) * 1000).format('llll');

    return <span>{val}</span>;
  };

  return (
    <MetricEntry
      type="process.start.time"
      valueRenderer={valueRenderer}
      {...passThroughProps}
    />
  );
};

export default ProcessStartTime;
