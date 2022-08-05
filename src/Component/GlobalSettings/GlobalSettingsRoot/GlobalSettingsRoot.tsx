import React, {
  useEffect
} from 'react';

import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  useEffect(() => {
  }, []);

  return (
    <div
      className="global-settings-root"
    >
      <PageHeader
        className="header"
        onBack={() => navigate(-1)}
        title={t('GlobalSettings.global')}
        subTitle={t('GlobalSettings.globalInfo')}
      />
      <div className="global-settings-container">
        <EvictCache />
      </div>
    </div>
  );
};

export default GlobalSettings;
