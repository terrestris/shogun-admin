import React from 'react';

import MetricEntry, { MetricEntryProps } from '../MetricEntry/MetricEntry';

interface JdbcConnectionsActiveProps extends Omit<MetricEntryProps, 'type'> { };

export const JdbcConnectionsActive: React.FC<JdbcConnectionsActiveProps> = ({
  ...passThroughProps
}) => {

  return (
    <MetricEntry
      type="jdbc.connections.active"
      {...passThroughProps}
    />
  );
};

export default JdbcConnectionsActive;
