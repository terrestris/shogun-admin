import React, { useState } from 'react';

import { Button } from 'antd';
import { Switch, Route } from 'react-router-dom';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

import Navigation from '../../Component/Menu/Navigation/Navigation';

import './Portal.less';
import ApplicationRoot from '../../Component/Application/ApplicationRoot/ApplicationRoot';
import WelcomeDashboard from '../../Component/WelcomeDashboard/WelcomeDashboard';
import UserProfile from '../../Component/Modal/UserProfile/UserProfile';
import ApplicationInfo from '../../Component/Modal/ApplicationInfo/ApplicationInfo';

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
            path="/portal/application"
            component={ApplicationRoot}
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
