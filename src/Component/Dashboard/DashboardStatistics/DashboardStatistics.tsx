import React, { useState } from 'react';

import {
  Statistic
} from 'antd';

import Application from '../../../Model/Application';
import User from '../../../Model/User';
import Layer from '../../../Model/Layer';
import GenericService from 'src/Service/GenericService/GenericService';


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
        title="Insgesamt verfügbar"
        value={`${entitiesCount} ${entitiesCount > 0 ? name.plural : name.singular}`}
      />
    </div>
  );
};

export default DashboardStatistics;
