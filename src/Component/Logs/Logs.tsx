import React, {
  useCallback,
  useEffect,
  useState
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Button,
  Input,
  PageHeader,
  Switch
} from 'antd';

const { TextArea } = Input;

import LogService from '../../Service/LogService/LogService';
import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

import { useTranslation } from 'react-i18next';

import './Logs.less';

type LogsProps = {};

export const Logs: React.FC<LogsProps> = (props) => {

  const [logs, setLogs] = useState<string>('');

  const client = useSHOGunAPIClient();

  let intervalTimer: NodeJS.Timer;

  const navigate = useNavigate();

  const {
    t
  } = useTranslation();

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

  const fetchLogs = useCallback(async () => {
    const logService = new LogService({
      keycloak: client.getKeycloak()
    });
    const fetchedLogs = await logService.getLogs();
    setLogs(fetchedLogs);
  }, [client]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div
      className="log-root"
    >
      <PageHeader
        className="header"
        onBack={() => navigate(-1)}
        title={t('Logs.logs')}
        subTitle={t('Logs.logsInfo')}
        extra={[
          <Switch
            key="reload"
            checkedChildren={t('Logs.reloadChecked')}
            unCheckedChildren={t('Logs.reloadUnChecked')}
            onChange={onChange}
          />,
          <Button
            key="fetch-logs"
            type="primary"
            onClick={fetchLogs}
          >
            {t('Logs.refresh')}
          </Button>
        ]}
      />
      <TextArea
        className="logs"
        value={logs}
        readOnly={true}
        bordered={false}
        autoSize
      />
    </div>
  );
};

export default Logs;
