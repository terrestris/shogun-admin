import React, { useState } from 'react';

import { Button } from 'antd';
import { Switch, Route } from 'react-router-dom';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

import Navigation from '../../Component/Menu/Navigation/Navigation';
import ApplicationRoot from '../../Component/Application/ApplicationRoot/ApplicationRoot';
import LayerRoot from '../../Component/Layer/LayerRoot/LayerRoot';
import WelcomeDashboard from '../../Component/WelcomeDashboard/WelcomeDashboard';
import UserProfile from '../../Component/Modal/UserProfile/UserProfile';
import ApplicationInfo from '../../Component/Modal/ApplicationInfo/ApplicationInfo';

import UserRoot from '../../Component/User/UserRoot/UserRoot';
import ImageFileRoot from '../../Component/ImageFile/ImageFileRoot/ImageFileRoot';
import Logs from '../../Component/Logs/Logs';
import LogSettingsRoot from '../../Component/LogSettings/LogSettingsRoot/LogSettingsRoot';
import MetricsRoot from '../../Component/Metrics/MetricsRoot/MetricsRoot';

import config from 'shogunApplicationConfig';

import './Portal.less';

interface OwnProps { }

type PortalProps = OwnProps;

export const Portal: React.FC<PortalProps> = props => {

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

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
          <Route
            path={`${config.appPrefix}/portal/application`}
            component={ApplicationRoot}
          />
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
