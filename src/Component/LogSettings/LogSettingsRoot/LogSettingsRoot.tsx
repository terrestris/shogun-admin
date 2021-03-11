import React from 'react';

import { useHistory } from 'react-router-dom';

import { PageHeader } from 'antd';

import LogLevelTable from '../LogLevelTable/LogLevelTable';

type LogSettingsRootProps = {};

export const LogSettingsRoot: React.FC<LogSettingsRootProps> = (props) => {

  const history = useHistory();

  return (
    <div
      className="log-root"
    >
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title="Einstellungen"
        subTitle="… die die Welt lenken"
      />
      <LogLevelTable />
    </div>
  );
};


export default LogSettingsRoot;
