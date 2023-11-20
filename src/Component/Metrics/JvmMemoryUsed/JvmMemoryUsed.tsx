import React, { ReactNode } from 'react';

import MetricEntry, { MetricEntryProps } from '../MetricEntry/MetricEntry';

interface JvmMemoryUsedProps extends Omit<MetricEntryProps, 'type'> { }

export const JvmMemoryUsed: React.FC<JvmMemoryUsedProps> = ({
  ...passThroughProps
}) => {

  const valueRenderer = (value: number | string): ReactNode => {
    const val = Number(value) * (9.537 * Math.pow(10, -7));
    return <span>{val.toFixed(2)}</span>;
  };

  const suffixRenderer = (): ReactNode => {
    return <span>MB</span>;
  };

  return (
    <MetricEntry
      type="jvm.memory.used"
      valueRenderer={valueRenderer}
      suffixRenderer={suffixRenderer}
      {...passThroughProps}
    />
  );
};

export default JvmMemoryUsed;
