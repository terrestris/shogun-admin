import React from 'react';

import MetricEntry, { MetricEntryProps } from '../MetricEntry/MetricEntry';

interface SystemCpuUsageProps extends Omit<MetricEntryProps, 'type'> { };

export const SystemCpuUsage: React.FC<SystemCpuUsageProps> = ({
  ...passThroughProps
}) => {

  return (
    <MetricEntry
      type="system.cpu.usage"
      {...passThroughProps}
    />
  );
};

export default SystemCpuUsage;
