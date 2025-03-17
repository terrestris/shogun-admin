import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import { PageHeader } from '@ant-design/pro-components';

import {
  Alert,
  Button,
  Form,
  Switch
} from 'antd';
import _isNil from 'lodash/isNil';


import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';
import LogService from '../../Service/LogService/LogService';

import './Logs.less';

interface LogsProps {}

export const Logs: React.FC<LogsProps> = () => {
  const [logs, setLogs] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const client = useSHOGunAPIClient();

  const intervalTimer = useRef<NodeJS.Timeout>(undefined);

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
      clearInterval(intervalTimer?.current);
      intervalTimer.current = undefined;
    }
  };

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(false);

      const logService = new LogService({
        keycloak: client?.getKeycloak()
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

  if (_isNil(client)) {
    return null;
  }

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
          <Form.Item
            key="reload"
            label={t('Logs.autoReload')}
            className='auto-reload-switch'
          >
            <Switch
              onChange={onChange}
            />
          </Form.Item>,
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
