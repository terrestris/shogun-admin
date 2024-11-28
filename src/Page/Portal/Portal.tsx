import './Portal.less';

import React, {
  useCallback,
  useState
} from 'react';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

import {
  Button,
  message
} from 'antd';
import _isEqual from 'lodash/isEqual';
import {
  Route,
  Routes
} from 'react-router-dom';
import {
  useSetRecoilState
} from 'recoil';
import config from 'shogunApplicationConfig';

import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import Layer from '@terrestris/shogun-util/dist/model/Layer';

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
import ToolbarCreateAllUsersButton from '../../Component/GeneralEntity/Slots/ToolbarCreateAllUsersButton/ToolbarCreateAllUsersButton';
import ToolbarCreateAllGroupsButton from '../../Component/GeneralEntity/Slots/ToolbarCreateAllGroupsButton/ToolbarCreateAllGroupsButton';
import ToolbarCreateAllRolesButton from '../../Component/GeneralEntity/Slots/ToolbarCreateAllRolesButton/ToolbarCreateAllRolesButton';
import ToolbarUploadLayerButton from '../../Component/GeneralEntity/Slots/ToolbarUploadLayerButton/ToolbarUploadLayerButton';
import {
  layerSuggestionListAtom
} from '../../State/atoms';

type PortalProps = {};

export const Portal: React.FC<PortalProps> = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [entitiesToLoad, setEntitiesToLoad] = useState<GeneralEntityConfigType<BaseEntity>[]>([]);
  const [configsAreLoading, setConfigsAreLoading] = useState<boolean>(false);

  const setLayerSuggestionList = useSetRecoilState(layerSuggestionListAtom);

  const toggleCollapsed = () => setCollapsed(!collapsed);

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
      config?.models?.map(fetchConfigForModel);
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

  const getLeftToolbarItems = (entityType: string): React.ReactNode => {
    switch (entityType) {
      case 'layer':
        return <ToolbarUploadLayerButton />;
      case 'user':
        return <ToolbarCreateAllUsersButton />
      case 'group':
        return <ToolbarCreateAllGroupsButton />;
      case 'role':
        return <ToolbarCreateAllRolesButton />;
      default:
        break;
    }
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
                  element={
                    <GeneralEntityRoot
                      key={entityConfig.entityType}
                      onEntitiesLoaded={onEntitiesLoaded}
                      slots={{
                        leftToolbar: getLeftToolbarItems(entityConfig.entityType)
                      }}
                      {...entityConfig}
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
