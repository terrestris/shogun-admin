import React from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';

import {
  BankOutlined,
  AppstoreOutlined,
  UserOutlined,
  FileImageOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';

import {
  Menu
} from 'antd';

import config from 'shogunApplicationConfig';

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
    history.push(`${config.appPrefix}/portal/${key}`);
  };

  const match = matchPath<{activeKey: string}>(location.pathname, {
    path: `${config.appPrefix}/portal/:activeKey`
  });

  const activeKey = match?.params?.activeKey;

  const navigationConf = config.navigation;

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
      <Menu.SubMenu
        key="general"
        title="Inhalte"
      >
        {
          navigationConf?.general?.applications?.visible &&
            <Menu.Item
              key="application"
            >
              <BankOutlined />
              <span>Applikationen</span>
            </Menu.Item>
        }
        {
          navigationConf?.general?.layers?.visible &&
            <Menu.Item
              key="layer"
            >
              <AppstoreOutlined />
              <span>Themen</span>
            </Menu.Item>
        }
        {
          navigationConf?.general?.users?.visible &&
            <Menu.Item
              key="user"
            >
              <UserOutlined />
              <span>Nutzer</span>
            </Menu.Item>
        }
        {
          navigationConf?.general?.imagefiles?.visible &&
            <Menu.Item
              key="imagefile"
            >
              <FileImageOutlined />
              <span>Bilddateien</span>
            </Menu.Item>
        }
      </Menu.SubMenu>
      <Menu.SubMenu
        key="status"
        title="Status"
      >
        {
          navigationConf?.status?.metrics?.visible &&
            <Menu.Item
              key="status/metrics"
            >
              <BarChartOutlined />
              <span>Metriken</span>
            </Menu.Item>
        }
        {
          navigationConf?.status?.logs?.visible &&
            <Menu.Item
              key="status/logs"
            >
              <FileTextOutlined />
              <span>Logs</span>
            </Menu.Item>
        }
      </Menu.SubMenu>
      <Menu.SubMenu
        key="settings"
        title="Einstellungen"
      >
        {
          navigationConf?.settings?.logs?.visible &&
            <Menu.Item
              key="settings/logs"
            >
              <FileTextOutlined />
              <span>Logs</span>
            </Menu.Item>
        }
      </Menu.SubMenu>
    </Menu>
  );
};

export default Navigation;
