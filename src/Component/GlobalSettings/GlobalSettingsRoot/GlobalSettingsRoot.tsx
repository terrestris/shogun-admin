import React from 'react';

import {PageHeader} from '@ant-design/pro-components';

import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import EvictCache from '../../../Component/EvictCache/EvictCache';

import './GlobalSettingsRoot.less';

interface LogsProps {}

export const GlobalSettings: React.FC<LogsProps> = () => {

  const {
    t
  } = useTranslation();

  const navigate = useNavigate();

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
