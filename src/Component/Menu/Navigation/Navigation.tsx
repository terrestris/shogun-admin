import React from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';

import {
  BankOutlined,
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

interface ExtensionType {
  menus: any[];
  status: any[];
  settings: any[];
};

interface OwnProps {
  collapsed?: boolean;
  entityConfigs?: GeneralEntityConfigType<BaseEntity>[];
  extensions: ExtensionType;
}

type NavigationProps = OwnProps;

export const Navigation: React.FC<NavigationProps> = ({
  collapsed = false,
  entityConfigs = [],
  extensions = {}
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
  const {
    menus,
    status,
    settings
  } = extensions as ExtensionType;

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
                <span>{entityConfig.navigationTitle}</span>
              </Menu.Item>
            );
          })
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
        {status && status.map((entry, idx) => {
          const Entry = entry;
          return <Entry key={`status-item-${idx}`} />;
        })}
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
        {settings && settings.map((entry, idx) => {
          const Entry = entry;
          return <Entry key={`settings-item-${idx}`} />;
        })}
      </Menu.SubMenu>
      {menus && menus.map((menu, idx) => {
        const CustomMenu = menu;
        return <CustomMenu key={`custom-menu-${idx}`} />;
      })}
    </Menu>
  );
};

export default Navigation;
