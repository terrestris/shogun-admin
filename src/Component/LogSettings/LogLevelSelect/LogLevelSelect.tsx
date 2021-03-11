import React from 'react';

import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';

import { LogLevel } from '../../../Service/LogService/LogService';

const { Option } = Select;

const logLevels: LogLevel[] = [
  'OFF',
  'FATAL',
  'ERROR',
  'WARN',
  'INFO',
  'DEBUG',
  'TRACE'
];

export interface LogLevelSelectProps extends SelectProps<LogLevel> { };

export const LogLevelSelect: React.FC<LogLevelSelectProps> = props => {

  const options = logLevels.map((logLevel, i) => {
    return (
      <Option
        key={i}
        value={`${logLevel}`}
      >
        {logLevel}
      </Option>
    );
  });

  return (
    <Select
      {...props}
    >
      { options }
    </Select>
  );
};

export default LogLevelSelect;
