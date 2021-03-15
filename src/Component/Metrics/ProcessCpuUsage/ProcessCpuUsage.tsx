import React from 'react';

import MetricEntry, { MetricEntryProps } from '../MetricEntry/MetricEntry';

interface ProcessCpuUsageProps extends Omit<MetricEntryProps, 'type'> { };

export const ProcessCpuUsage: React.FC<ProcessCpuUsageProps> = ({
  ...passThroughProps
}) => {

  return (
    <MetricEntry
      type="process.cpu.usage"
      {...passThroughProps}
    />
  );
};

export default ProcessCpuUsage;
