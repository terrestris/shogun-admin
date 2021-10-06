import React, { useState } from 'react';

import { Button, message } from 'antd';
import { Switch, Route } from 'react-router-dom';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

import Navigation from '../../Component/Menu/Navigation/Navigation';
import LayerRoot from '../../Component/Layer/LayerRoot/LayerRoot';
import WelcomeDashboard from '../../Component/WelcomeDashboard/WelcomeDashboard';
import UserProfile from '../../Component/Modal/UserProfile/UserProfile';
import ApplicationInfo from '../../Component/Modal/ApplicationInfo/ApplicationInfo';

import UserRoot from '../../Component/User/UserRoot/UserRoot';
import ImageFileRoot from '../../Component/ImageFile/ImageFileRoot/ImageFileRoot';
import Logs from '../../Component/Logs/Logs';
import GlobalSettingsRoot from '../../Component/GlobalSettings/GlobalSettingsRoot/GlobalSettingsRoot';
import LogSettingsRoot from '../../Component/LogSettings/LogSettingsRoot/LogSettingsRoot';
import MetricsRoot from '../../Component/Metrics/MetricsRoot/MetricsRoot';
import { keycloak } from '../../Util/KeyCloakUtil';

import config from 'shogunApplicationConfig';

import './Portal.less';
import GeneralEntityRoot,
{ GeneralEntityConfigType } from '../../Component/GeneralEntity/GeneralEntityRoot/GeneralEntityRoot';
import { CsrfUtil } from '@terrestris/base-util';
import _toLowerCase from 'lodash/lowerCase';

interface OwnProps { }

type PortalProps = OwnProps;

export const Portal: React.FC<PortalProps> = () => {

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const [entitiesToLoad, setEntitiesToLoad] = useState<GeneralEntityConfigType[]>([]);
  const [configsAreLoading, setConfigsAreLoading] = useState<boolean>(false);

  const fetchConfigsForModels = async () => {
    setConfigsAreLoading(true);
    const promises = config?.models?.map((modelName: string) => {
      if (!keycloak.token) {
        return Promise.reject('No keycloak token available.');
      }
      const reqOpts = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie(),
          'Authorization': `Bearer ${keycloak.token}`
        }
      };
      return fetch(`${config.path.configBase}/${_toLowerCase(modelName)}.json`, reqOpts)
        .then(response => {
          if (response.ok) {
            if (response.status === 204) {
              // No Data
              return Promise.resolve();
            }
            return response.json();
          } else {
            throw new Error(response.statusText);
          }
        });
    });

    await Promise.all(promises)
      .then((formConfigs: GeneralEntityConfigType[]) => setEntitiesToLoad(formConfigs))
      .catch(() => message.error('Could not load configuration.'))
      .finally(() => setConfigsAreLoading(false));
  };

  if (config?.models?.length !== entitiesToLoad?.length && !configsAreLoading) {
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
        />
      </div>
      <div className="content">
        <Switch>
          {
            entitiesToLoad.map(entityConfig => <Route
              key={entityConfig.endpoint}
              path={`${config.appPrefix}/portal/${entityConfig?.entityType}`}
              render={() => <GeneralEntityRoot
                {...entityConfig}
              />}
            />)
          }
          <Route
            path={`${config.appPrefix}/portal/layer`}
            component={LayerRoot}
          />
          <Route
            path={`${config.appPrefix}/portal/user`}
            component={UserRoot}
          />
          <Route
            path={`${config.appPrefix}/portal/imagefile`}
            component={ImageFileRoot}
          />
          <Route
            path={`${config.appPrefix}/portal/status/metrics`}
            component={MetricsRoot}
          />
          <Route
            path={`${config.appPrefix}/portal/status/logs`}
            component={Logs}
          />
          <Route
            path={`${config.appPrefix}/portal/settings/global`}
            component={GlobalSettingsRoot}
          />
          <Route
            path={`${config.appPrefix}/portal/settings/logs`}
            component={LogSettingsRoot}
          />
          <Route
            component={WelcomeDashboard}
          />
        </Switch>
      </div>
      <>
        <UserProfile />
        <ApplicationInfo />
      </>
    </div>
  );
};

export default Portal;
