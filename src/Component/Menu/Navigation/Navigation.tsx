import React from 'react';
import { useHistory } from 'react-router-dom';

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
  let history = useHistory();

  const {
    collapsed = false
  } = props;

  const onSelect = ({ item, key }) => {
    history.push(`/portal/${key}`);
  };

  return (
    <Menu
      className="navigation-menu"
      defaultSelectedKeys={['1']}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
      onSelect={onSelect}
      selectedKeys={[history.location.pathname.replace('/portal/', '')]}
      defaultOpenKeys={['general', 'project']}
    >
      <Menu.SubMenu key="general" title="Allgemein">
        <Menu.Item key={'application'}>
          <BankOutlined />
          <span>Applikationen</span>
        </Menu.Item>
        <Menu.Item key={'layer'}>
          <CarOutlined />
          <span>Layer</span>
        </Menu.Item>
        <Menu.Item key={'user'}>
          <CarOutlined />
          <span>Nutzer</span>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default Navigation;
