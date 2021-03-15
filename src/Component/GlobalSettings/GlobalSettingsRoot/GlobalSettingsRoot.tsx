import React, {
  useEffect
} from 'react';

import { useHistory } from 'react-router-dom';

import {
  PageHeader
} from 'antd';

import EvictCache from '../../../Component/EvictCache/EvictCache';

import './GlobalSettingsRoot.less';

type LogsProps = {};

export const GlobalSettings: React.FC<LogsProps> = (props) => {

  const history = useHistory();

  useEffect(() => {
  }, []);

  return (
    <div
      className="global-settings-root"
    >
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title="Einstellungen"
        subTitle="… die die Welt lenken"
      />
      <div className="global-settings-container">
        <EvictCache />
      </div>
    </div>
  );
};

export default GlobalSettings;
