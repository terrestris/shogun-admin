import React, {
  useEffect,
  useState
} from 'react';

import {
  message,
  Table
} from 'antd';
import { TableProps } from 'antd/lib/table';

import { useKeycloak } from '@react-keycloak/web';

import LogLevelSelect from '../LogLevelSelect/LogLevelSelect';

import LogService, { LogLevel } from '../../../Service/LogService/LogService';

interface TableData {
  key: number;
  name: string;
  level: LogLevel;
};

interface LogLevelTableProps extends Omit<TableProps<TableData>, 'loading' | 'columns' | 'dataSource'> { };

export const LogLevelTable: React.FC<LogLevelTableProps> = props => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<TableData[]>([]);

  const { keycloak } = useKeycloak();

  useEffect(() => {
    fetchLoggers();
  }, []);

  const fetchLoggers = async () => {
    setIsLoading(true);

    const logService = new LogService({
      keycloak: keycloak
    });
    const loggers = await logService.getLoggers();

    const tableData = Object.keys(loggers)
      .filter(l => l.split('.').length === 2)
      .map((loggerName, i) => ({
        key: i,
        name: loggerName,
        level: loggers[loggerName].effectiveLevel
      }));

    setData(tableData);

    setIsLoading(false);
  };

  const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
    render: (level: LogLevel, record: TableData) => (
      <LogLevelSelect
        style={{
          width: '100%'
        }}
        defaultValue={level}
        onChange={(lvl: LogLevel) => {
          onLoggerChange(lvl, record);
        }}
      />
    )
  }];

  const onLoggerChange = (level: LogLevel, record: TableData) => {
    const logService = new LogService({
      keycloak: keycloak
    });
    const success = logService.setLogger(record.name, level);

    if (success) {
      message.success('Successfully set log level');
    } else {
      message.error('Could not set log level');
    }
  };

  return (
    <Table
      loading={isLoading}
      columns={columns}
      dataSource={data}
      {...props}
    />
  );
};


export default LogLevelTable;
