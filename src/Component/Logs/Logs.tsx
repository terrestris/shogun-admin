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
import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

import { useTranslation } from 'react-i18next';

import './Logs.less';

type LogsProps = {};

export const Logs: React.FC<LogsProps> = (props) => {

  const [logs, setLogs] = useState<string>('');

  const client = useSHOGunAPIClient();

  let intervalTimer;

  const history = useHistory();

  const {
    t
  } = useTranslation();

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
      keycloak: client.getKeycloak()
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
        title={t('Status.logs')}
        subTitle={t('Status.logsInfo')}
        extra={[
          <Switch
            key="reload"
            checkedChildren={t('Status.reloadChecked')}
            unCheckedChildren={t('Status.reloadUnChecked')}
            onChange={onChange}
          />,
          <Button
            key="fetch-logs"
            type="primary"
            onClick={fetchLogs}
          >
            {t('Status.refresh')}
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
