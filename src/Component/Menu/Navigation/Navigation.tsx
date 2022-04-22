import React from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';

import {
  BankOutlined,
  UserOutlined,
  FileImageOutlined,
  FileTextOutlined,
  ControlOutlined,
  BarChartOutlined
} from '@ant-design/icons';

import {
  Menu
} from 'antd';

import config from 'shogunApplicationConfig';
import { GeneralEntityConfigType } from '../../GeneralEntity/GeneralEntityRoot/GeneralEntityRoot';
import BaseEntity from '../../../Model/BaseEntity';

interface OwnProps {
  collapsed?: boolean;
  entityConfigs?: GeneralEntityConfigType<BaseEntity>[];
}

type NavigationProps = OwnProps;

export const Navigation: React.FC<NavigationProps> = ({
  collapsed = false,
  entityConfigs = []
}) => {

  const history = useHistory();
  const location = useLocation();

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
          entityConfigs.map(entityConfig => {
            return (
              <Menu.Item
                key={entityConfig.entityType}
              >
                <BankOutlined />
                <span>{entityConfig.entityName}</span>
              </Menu.Item>
            );
          })
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
          navigationConf?.settings?.global?.visible &&
            <Menu.Item
              key="settings/global"
            >
              <ControlOutlined />
              <span>Global</span>
            </Menu.Item>
        }
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
