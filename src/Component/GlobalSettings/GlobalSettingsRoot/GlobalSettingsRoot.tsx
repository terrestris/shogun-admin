import React, {
  useEffect
} from 'react';

import { useHistory } from 'react-router-dom';

import {
  PageHeader
} from 'antd';

import EvictCache from '../../../Component/EvictCache/EvictCache';

import { useTranslation } from 'react-i18next';

import './GlobalSettingsRoot.less';

type LogsProps = {};

export const GlobalSettings: React.FC<LogsProps> = (props) => {

  const {
    t
  } = useTranslation();

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
        title={t('LogSettings.global')}
        subTitle={t('LogSettings.globalInfo')}
      />
      <div className="global-settings-container">
        <EvictCache />
      </div>
    </div>
  );
};

export default GlobalSettings;
