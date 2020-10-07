import React, { useState } from 'react';

import { Button } from 'antd';
import { Switch, Route } from 'react-router-dom';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

import Navigation from '../../Component/Menu/Navigation/Navigation';

import './Portal.less';
import ApplicationRoot from '../../Component/Application/ApplicationRoot';

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
            render={
              () => <div className="home">
                <h1>SHOGun admin</h1>
              </div>
            }
          />
        </Switch>
      </div>
    </div>
  );
};

export default Portal;
