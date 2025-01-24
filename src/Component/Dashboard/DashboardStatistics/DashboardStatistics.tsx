import './DashboardStatistics.less';

import React, { useState } from 'react';

import {
  Statistic
} from 'antd';

import {
  useTranslation
} from 'react-i18next';

import logger from '@terrestris/base-util/dist/Logger';
import Application from '@terrestris/shogun-util/dist/model/Application';
import Layer from '@terrestris/shogun-util/dist/model/Layer';
import User from '@terrestris/shogun-util/dist/model/User';
import GenericEntityService from '@terrestris/shogun-util/dist/service/GenericEntityService';

interface DashboardStatisticsProps {
  service: GenericEntityService<Application | User | Layer>;
  name: {
    singular: string;
    plural: string;
  };
}

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
      const fetchedEntities = await service?.findAll({
        page: 0,
        size: 1
      });
      const count = fetchedEntities.totalElements;
      setEntitiesCount(count);
      setLoadingState('done');
    } catch (error) {
      setLoadingState('failed');
      logger.error(`Could not fetch entities due to the following error: ${error}`);
    }
  };

  if (!loadingState && entitiesCount < 0) {
    fetchEntities();
  }

  return (
    <div className="statistics-card">
      <Statistic
        title={t('DashboardStatistics.statisticsTitle')}
        value={`${entitiesCount} ${entitiesCount > 0 ? name.plural : name.singular}`}
      />
    </div>
  );
};

export default DashboardStatistics;
