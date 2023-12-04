import React, {
  useEffect,
  useState
} from 'react';

import {
  Input,
  message,
  Table
} from 'antd';
import { TableProps } from 'antd/lib/table';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { useTranslation } from 'react-i18next';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import LogService, { LogLevel } from '../../../Service/LogService/LogService';
import LogLevelSelect from '../LogLevelSelect/LogLevelSelect';

interface TableData {
  key: number;
  name: string;
  level: LogLevel;
}

interface LogLevelTableProps extends Omit<TableProps<TableData>, 'loading' | 'columns' | 'dataSource'> { }

export const LogLevelTable: React.FC<LogLevelTableProps> = props => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<TableData[]>([]);
  const [filteredData, setFilteredData] = useState<TableData[]>([]);

  const client = useSHOGunAPIClient();

  const {
    t
  } = useTranslation();

  useEffect(() => {
    const fetchLoggers = async () => {
      setIsLoading(true);

      const logService = new LogService({
        keycloak: client?.getKeycloak()
      });
      const loggers = await logService.getLoggers();

      const tableData = Object.keys(loggers)
        .filter(l => l.split('.').length === 2 || l === 'org.springframework.security')
        .filter(l => !l.startsWith('_'))
        .map((loggerName, i) => ({
          key: i,
          name: loggerName,
          level: loggers[loggerName].effectiveLevel
        }));

      setData(tableData);

      setIsLoading(false);
    };

    fetchLoggers();
  }, [client]);

  const columns = [{
    title: t('LogSettings.tableName'),
    dataIndex: 'name',
    key: 'name',
  }, {
    title: t('LogSettings.tableLevel'),
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

  const onLoggerChange = async (level: LogLevel, record: TableData) => {
    const logService = new LogService({
      keycloak: client?.getKeycloak()
    });
    const success = await logService.setLogger(record.name, level);
    if (success) {
      message.success('Successfully set log level');
    } else {
      message.error('Could not set log level');
    }
  };

  const search = (searchValue: string) => {
    const filtered = data.filter(o =>
      Object.keys(o).some(k =>
        String(_get(o, k))
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  if (_isNil(client)) {
    return null;
  }

  return (
    <>
      <Input.Search
        style={{ margin: '0 0 10px 0' }}
        placeholder={t('LogSettings.searchPlaceholder')}
        enterButton
        onSearch={search}
      />
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={filteredData.length === 0 ? data : filteredData}
        {...props}
      />
    </>
  );
};


export default LogLevelTable;
