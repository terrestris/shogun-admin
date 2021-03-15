import React from 'react';

import MetricEntry, { MetricEntryProps } from '../MetricEntry/MetricEntry';

interface JvmThreadsLiveProps extends Omit<MetricEntryProps, 'type'> { };

export const JvmThreadsLive: React.FC<JvmThreadsLiveProps> = ({
  ...passThroughProps
}) => {

  return (
    <MetricEntry
      type="jvm.threads.live"
      {...passThroughProps}
    />
  );
};

export default JvmThreadsLive;
