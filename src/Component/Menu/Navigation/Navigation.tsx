import React from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';

import {
  BankOutlined,
  CarOutlined
} from '@ant-design/icons';

import {
  Menu
} from 'antd';

interface OwnProps {
  collapsed?: boolean;
}

type NavigationProps = OwnProps;

export const Navigation: React.FC<NavigationProps> = (props) => {
  const history = useHistory();
  const location = useLocation();

  const {
    collapsed = false
  } = props;

  const onSelect = ({ key }) => {
    history.push(`/portal/${key}`);
  };

  const match = matchPath<{activeKey: string}>(location.pathname, {
    path: '/portal/:activeKey'
  });
  const activeKey = match?.params?.activeKey;

  return (
    <Menu
      className="navigation-menu"
      defaultSelectedKeys={['1']}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
      onSelect={onSelect}
      selectedKeys={[activeKey]}
      defaultOpenKeys={['general']}
    >
      <Menu.SubMenu key="general" title="Allgemein">
        <Menu.Item key="application">
          <BankOutlined />
          <span>Applikationen</span>
        </Menu.Item>
        <Menu.Item key="layer">
          <CarOutlined />
          <span>Layer</span>
        </Menu.Item>
        <Menu.Item key="user">
          <CarOutlined />
          <span>Nutzer</span>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default Navigation;
