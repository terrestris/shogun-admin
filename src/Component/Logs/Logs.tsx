import React, {
  useEffect,
  useState
} from 'react';

import { useHistory } from 'react-router-dom';

import {
  Button,
  Input,
  PageHeader,
  Switch
} from 'antd';

const { TextArea } = Input;

import LogService from '../../Service/LogService/LogService';

import './Logs.less';

const logService = new LogService();

type LogsProps = {};

export const Logs: React.FC<LogsProps> = (props) => {

  const [logs, setLogs] = useState<string>('');

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
    const logs = await logService.getLogs();

    setLogs(logs);
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
            checkedChildren="Live Reload"
            unCheckedChildren="No Reload"
            onChange={onChange}
          />,
          <Button
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
