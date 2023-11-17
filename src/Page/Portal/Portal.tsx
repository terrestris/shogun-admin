import './Portal.less';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import Layer from '@terrestris/shogun-util/dist/model/Layer';
import {
  Button,
  message
} from 'antd';
import _isEqual from 'lodash/isEqual';
import React, {
  useCallback,
  useState
} from 'react';
import {Route,
  Routes} from 'react-router-dom';
import {
  useSetRecoilState
} from 'recoil';
import config from 'shogunApplicationConfig';

import GeneralEntityRoot, {
  GeneralEntityConfigType
} from '../../Component/GeneralEntity/GeneralEntityRoot/GeneralEntityRoot';
import GlobalSettingsRoot from '../../Component/GlobalSettings/GlobalSettingsRoot/GlobalSettingsRoot';
import ImageFileRoot from '../../Component/ImageFile/ImageFileRoot/ImageFileRoot';
import Logs from '../../Component/Logs/Logs';
import LogSettingsRoot from '../../Component/LogSettings/LogSettingsRoot/LogSettingsRoot';
import Navigation from '../../Component/Menu/Navigation/Navigation';
import MetricsRoot from '../../Component/Metrics/MetricsRoot/MetricsRoot';
import ApplicationInfo from '../../Component/Modal/ApplicationInfo/ApplicationInfo';
import WelcomeDashboard from '../../Component/WelcomeDashboard/WelcomeDashboard';
import {
  layerSuggestionListAtom
} from '../../State/atoms';

interface OwnProps { }

type PortalProps = OwnProps;

export const Portal: React.FC<PortalProps> = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const [entitiesToLoad, setEntitiesToLoad] = useState<GeneralEntityConfigType<BaseEntity>[]>([]);
  const [configsAreLoading, setConfigsAreLoading] = useState<boolean>(false);

  const setLayerSuggestionList = useSetRecoilState(layerSuggestionListAtom);

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
        return Promise.reject();
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

  const onEntitiesLoaded = useCallback((entities: BaseEntity[], entityType: string) => {
    if (entityType === 'layer') {
      const layers = entities as Layer[];
      setLayerSuggestionList(layers);
    }
  }, [setLayerSuggestionList]);

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
                  element={
                    <GeneralEntityRoot
                      {...entityConfig}
                      onEntitiesLoaded={onEntitiesLoaded}
                    />
                  }
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
