import React from 'react';

import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import LogLevelTable from '../LogLevelTable/LogLevelTable';

type LogSettingsRootProps = {};

export const LogSettingsRoot: React.FC<LogSettingsRootProps> = (props) => {

  const {
    t
  } = useTranslation();

  const navigate = useNavigate();

  return (
    <div
      className="log-root"
    >
      <PageHeader
        className="header"
        onBack={() => navigate(-1)}
        title={t('LogSettings.logs')}
        subTitle={t('LogSettings.logsInfo')}
      />
      <LogLevelTable />
    </div>
  );
};


export default LogSettingsRoot;
