import React from 'react';

import MetricEntry, { MetricEntryProps } from '../MetricEntry/MetricEntry';

interface SystemLoadAverageProps extends Omit<MetricEntryProps, 'type'> { };

export const SystemLoadAverage: React.FC<SystemLoadAverageProps> = ({
  ...passThroughProps
}) => {

  return (
    <MetricEntry
      type="system.load.average.1m"
      {...passThroughProps}
    />
  );
};

export default SystemLoadAverage;
