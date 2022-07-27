import React from 'react';

import { useTranslation } from 'react-i18next';

import { useHistory } from 'react-router-dom';

import { PageHeader } from 'antd';

import LogLevelTable from '../LogLevelTable/LogLevelTable';

type LogSettingsRootProps = {};

export const LogSettingsRoot: React.FC<LogSettingsRootProps> = (props) => {

  const {
    t
  } = useTranslation();

  const history = useHistory();

  return (
    <div
      className="log-root"
    >
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title={t('GlobalSettingsRoot.logs')}
        subTitle={t('GlobalSettingsRoot.logsInfo')}
      />
      <LogLevelTable />
    </div>
  );
};


export default LogSettingsRoot;
