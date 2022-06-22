import React, {
  useEffect,
  useState
} from 'react';

import { useHistory } from 'react-router-dom';

import { useKeycloak } from '@react-keycloak/web';

import {
  Button,
  Input,
  PageHeader,
  Switch
} from 'antd';

const { TextArea } = Input;

import LogService from '../../Service/LogService/LogService';

import './Logs.less';

type LogsProps = {};

export const Logs: React.FC<LogsProps> = (props) => {

  const [logs, setLogs] = useState<string>('');

  const { keycloak } = useKeycloak();

  let intervalTimer;

  const history = useHistory();

  useEffect(() => {
    fetchLogs();
  }, []);

  const onChange = (checked: boolean) => {
    if (checked) {
      if (!intervalTimer) {
        intervalTimer = setInterval(fetchLogs, 1000);
      }
    } else {
      clearInterval(intervalTimer);
      intervalTimer = undefined;
    }
  };

  const fetchLogs = async () => {
    const logService = new LogService({
      keycloak: keycloak
    });
    const fetchedLogs = await logService.getLogs();

    setLogs(fetchedLogs);
  };

  return (
    <div
      className="log-root"
    >
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title="Logs"
        subTitle="… die die Welt erklären"
        extra={[
          <Switch
            key="reload"
            checkedChildren="Live Reload"
            unCheckedChildren="No Reload"
            onChange={onChange}
          />,
          <Button
            key="fetch-logs"
            type="primary"
            onClick={fetchLogs}
          >
            Refresh
          </Button>
        ]}
      />
      <TextArea
        className="logs"
        value={logs}
        readOnly={true}
        bordered={false}
      />
    </div>
  );
};

export default Logs;
