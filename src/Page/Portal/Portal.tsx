import React, {
  useState
} from 'react';

import {
  Button,
  message
} from 'antd';

import {
  Routes,
  Route
} from 'react-router-dom';

import _isEqual from 'lodash/isEqual';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';

import Navigation from '../../Component/Menu/Navigation/Navigation';
import WelcomeDashboard from '../../Component/WelcomeDashboard/WelcomeDashboard';
import ApplicationInfo from '../../Component/Modal/ApplicationInfo/ApplicationInfo';

import ImageFileRoot from '../../Component/ImageFile/ImageFileRoot/ImageFileRoot';
import Logs from '../../Component/Logs/Logs';
import GlobalSettingsRoot from '../../Component/GlobalSettings/GlobalSettingsRoot/GlobalSettingsRoot';
import LogSettingsRoot from '../../Component/LogSettings/LogSettingsRoot/LogSettingsRoot';
import MetricsRoot from '../../Component/Metrics/MetricsRoot/MetricsRoot';

import config from 'shogunApplicationConfig';

import GeneralEntityRoot, {
  GeneralEntityConfigType
} from '../../Component/GeneralEntity/GeneralEntityRoot/GeneralEntityRoot';

import './Portal.less';

interface OwnProps { }

type PortalProps = OwnProps;

export const Portal: React.FC<PortalProps> = () => {

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const [entitiesToLoad, setEntitiesToLoad] = useState<GeneralEntityConfigType<BaseEntity>[]>([]);
  const [configsAreLoading, setConfigsAreLoading] = useState<boolean>(false);

  const fetchConfigForModel = async (modelName: string): Promise<GeneralEntityConfigType<BaseEntity>> => {
    const reqOpts = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const modelPath = `${config.path.modelConfigs}/${(modelName.toLowerCase())}.json`;
    const response = await fetch(modelPath, reqOpts);
    if (response.ok) {
      if (response.status === 204) {
        // No Data
        return null;
      }
      return await response.json() as GeneralEntityConfigType<BaseEntity>;
    } else {
      message.error(`Could not load config for model: ${modelName}`);
      throw new Error(response.statusText);
    }
  };

  const fetchConfigsForModels = async () => {
    setConfigsAreLoading(true);
    const formConfigsPromises: Promise<GeneralEntityConfigType<BaseEntity>>[] =
      await config?.models?.map(fetchConfigForModel);
    const formConfigs: GeneralEntityConfigType<BaseEntity>[] = await Promise.all(formConfigsPromises);
    if (!_isEqual(formConfigs, entitiesToLoad)) {
      setEntitiesToLoad(formConfigs);
    }
    setConfigsAreLoading(false);
  };

  if (config?.models && config?.models?.length !== entitiesToLoad?.length && !configsAreLoading) {
    fetchConfigsForModels();
  }

  return (
    <div className="portal">
      <div className="menu">
        <Button
          className="menu-toggle-button"
          type="primary"
          onClick={toggleCollapsed}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Navigation
          collapsed={collapsed}
          entityConfigs={entitiesToLoad}
        />
      </div>
      <div className="content">
        <Routes>
          <Route
            path={'/'}
            element={<WelcomeDashboard />}
          />
          {
            !configsAreLoading && entitiesToLoad?.map(entityConfig => {
              return (
                <Route
                  key={entityConfig.entityType}
                  path={`${entityConfig?.entityType}/*`}
                  element={<GeneralEntityRoot
                    {...entityConfig}
                  />}
                />
              );
            })
          }
          <Route
            path={'imagefile/*'}
            element={<ImageFileRoot />}
          />
          <Route
            path={'status/metrics/*'}
            element={<MetricsRoot />}
          />
          <Route
            path={'status/logs/*'}
            element={<Logs />}
          />
          <Route
            path={'settings/global/*'}
            element={<GlobalSettingsRoot />}
          />
          <Route
            path={'settings/logs/*'}
            element={<LogSettingsRoot />}
          />
        </Routes>
      </div>
      <>
        <ApplicationInfo />
      </>
    </div>
  );
};

export default Portal;
