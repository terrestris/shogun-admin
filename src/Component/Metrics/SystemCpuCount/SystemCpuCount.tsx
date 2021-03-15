import React from 'react';

import MetricEntry, { MetricEntryProps } from '../MetricEntry/MetricEntry';

interface SystemCpuCountProps extends Omit<MetricEntryProps, 'type'> { };

export const SystemCpuCount: React.FC<SystemCpuCountProps> = ({
  ...passThroughProps
}) => {

  return (
    <MetricEntry
      type="system.cpu.count"
      {...passThroughProps}
    />
  );
};

export default SystemCpuCount;
