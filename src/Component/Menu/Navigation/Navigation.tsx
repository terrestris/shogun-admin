import React from 'react';
import { matchPath, useNavigate, useLocation } from 'react-router-dom';

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
import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';

import {
  useTranslation
} from 'react-i18next';

import TranslationUtil from '../../../Util/TranslationUtil';

interface OwnProps {
  collapsed?: boolean;
  entityConfigs?: GeneralEntityConfigType<BaseEntity>[];
}

type NavigationProps = OwnProps;

export const Navigation: React.FC<NavigationProps> = ({
  collapsed = false,
  entityConfigs = []
}) => {
  const {
    t
  } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const onSelect = ({ key }) => {
    navigate(`${config.appPrefix}/portal/${key}`);
  };

  const match = matchPath({
    path: `${config.appPrefix}/portal/:activeKey`
  }, location.pathname);

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
        title={t('Navigation.content')}
      >
        {
          entityConfigs.map(entityConfig => (
            <Menu.Item
              key={entityConfig.entityType}
            >
              <BankOutlined />
              <span>{TranslationUtil.getTranslationFromConfig(entityConfig.navigationTitle, entityConfig.i18n)}</span>
            </Menu.Item>
          ))
        }
        {
          navigationConf?.general?.imagefiles?.visible &&
          <Menu.Item
            key="imagefile"
          >
            <FileImageOutlined />
            <span>{t('Navigation.image')}</span>
          </Menu.Item>
        }
      </Menu.SubMenu>
      <Menu.SubMenu
        key="status"
        title={t('Navigation.status')}
      >
        {
          navigationConf?.status?.metrics?.visible &&
          <Menu.Item
            key="status/metrics"
          >
            <BarChartOutlined />
            <span>{t('Navigation.metrics')}</span>
          </Menu.Item>
        }
        {
          navigationConf?.status?.logs?.visible &&
          <Menu.Item
            key="status/logs"
          >
            <FileTextOutlined />
            <span>{t('Navigation.logs')}</span>
          </Menu.Item>
        }
      </Menu.SubMenu>
      <Menu.SubMenu
        key="settings"
        title={t('Navigation.configuration')}
      >
        {
          navigationConf?.settings?.global?.visible &&
          <Menu.Item
            key="settings/global"
          >
            <ControlOutlined />
            <span>{t('Navigation.global')}</span>
          </Menu.Item>
        }
        {
          navigationConf?.settings?.logs?.visible &&
          <Menu.Item
            key="settings/logs"
          >
            <FileTextOutlined />
            <span>{t('Navigation.logs')}</span>
          </Menu.Item>
        }
      </Menu.SubMenu>
    </Menu>
  );
};

export default Navigation;
