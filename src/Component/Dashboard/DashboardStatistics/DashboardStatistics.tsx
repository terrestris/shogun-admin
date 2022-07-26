import React, { useState } from 'react';

import {
  Statistic
} from 'antd';

import Application from '@terrestris/shogun-util/dist/model/Application';
import User from '@terrestris/shogun-util/dist/model/User';
import Layer from '@terrestris/shogun-util/dist/model/Layer';
import GenericService from '@terrestris/shogun-util/dist/service/GenericService';

import {
  useTranslation
} from 'react-i18next';

type DashboardStatisticsProps = {
  service: GenericService<Application | User | Layer>;
  name: {
    singular: string;
    plural: string;
  };
};

import './DashboardStatistics.less';

export const DashboardStatistics: React.FC<DashboardStatisticsProps> = ({
  service,
  name
}) => {
  const {
    t
  } = useTranslation();

  const [entitiesCount, setEntitiesCount] = useState<number>(-1);
  const [loadingState, setLoadingState] = useState<'failed' | 'loading' | 'done'>();

  const fetchEntities = async () => {
    setLoadingState('loading');
    try {
      const fetchedEntities = await service?.findAll();
      const count = fetchedEntities.length || 0;
      setEntitiesCount(count);
      setLoadingState('done');
    } catch (error) {
      setLoadingState('failed');
    }
  };

  if (!loadingState && entitiesCount < 0) {
    fetchEntities();
  }

  return (
    <div className="statistics-card">
      <Statistic
        title={t('Dashboard.statisticsTitle')}
        value={`${entitiesCount} ${entitiesCount > 0 ? name.plural : name.singular}`}
      />
    </div>
  );
};

export default DashboardStatistics;
