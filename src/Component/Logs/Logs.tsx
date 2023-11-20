import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Button,
  PageHeader,
  Switch
} from 'antd';

import LogService from '../../Service/LogService/LogService';
import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

import { useTranslation } from 'react-i18next';

import './Logs.less';

type LogsProps = {};

export const Logs: React.FC<LogsProps> = (props) => {
  const [logs, setLogs] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const client = useSHOGunAPIClient();

  const intervalTimer = useRef<NodeJS.Timer>();

  const navigate = useNavigate();

  const {
    t
  } = useTranslation();

  const onChange = (checked: boolean) => {
    if (checked) {
      if (!intervalTimer.current) {
        intervalTimer.current = setInterval(fetchLogs, 1000);
      }
    } else {
      clearInterval(intervalTimer.current);
      intervalTimer.current = undefined;
    }
  };

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(false);

      const logService = new LogService({
        keycloak: client.getKeycloak()
      });

      const fetchedLogs = await logService.getLogs();

      setLogs(fetchedLogs);

      if (!fetchedLogs) {
        setError(true);
      }
    } finally {
      setIsLoading(false);
    }
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
            loading={isLoading}
            onClick={fetchLogs}
          >
            {t('Logs.refresh')}
          </Button>
        ]}
      />
      <div
        className="log-container"
      >
        {
          error ? (
            <Alert
              message={t('Logs.warningMessage')}
              description={t('Logs.warningDescribtion')}
              type="warning"
              showIcon
            />
          ) : (
            <pre>
              <code>
                { logs }
              </code>
            </pre>
          )
        }
      </div>
    </div>
  );
};

export default Logs;
