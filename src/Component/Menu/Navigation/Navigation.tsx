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
import { ItemType } from 'antd/lib/menu/hooks/useItems';

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

  const navigationContentChildren: ItemType[] = entityConfigs.map(conf => ({
    key: conf.entityType,
    label: (
      <>
        <BankOutlined />
        <span>{TranslationUtil.getTranslationFromConfig(conf.navigationTitle, conf.i18n)}</span>
      </>
    )
  }));

  if (navigationConf?.general?.imagefiles?.visible) {
    navigationContentChildren.push({
      key: 'imagefile',
      label: (
        <>
          <FileImageOutlined />
          <span>{t('Navigation.image')}</span>
        </>
      )
    });
  }

  const statusChildren: ItemType[] = [];

  if (navigationConf?.status?.metrics?.visible) {
    statusChildren.push({
      key: 'status/metrics',
      label: (
        <>
          <BarChartOutlined />
          <span>{t('Navigation.metrics')}</span>
        </>
      )
    });
  }
  if (navigationConf?.status?.logs?.visible) {
    statusChildren.push({
      key: 'status/logs',
      label: (
        <>
          <FileTextOutlined />
          <span>{t('Navigation.logs')}</span>
        </>
      )
    });
  }

  const settingsChildren: ItemType[] = [];

  if (navigationConf?.settings?.global?.visible) {
    settingsChildren.push({
      key: 'settings/global',
      label: (
        <>
          <ControlOutlined />
          <span>{t('Navigation.global')}</span>
        </>
      )
    });
  }
  if (navigationConf?.settings?.logs?.visible) {
    settingsChildren.push({
      key: 'settings/logs',
      label: (
        <>
          <FileTextOutlined />
          <span>{t('Navigation.logs')}</span>
        </>
      )
    });
  }

  const items: ItemType[] = [];
  if (navigationContentChildren.length > 0) {
    items.push({
      key: 'general',
      label: t('Navigation.content'),
      children: navigationContentChildren
    });
  }
  if (statusChildren.length > 0) {
    items.push({
      key: 'status',
      label: t('Navigation.status'),
      children: statusChildren
    });
  }
  if (settingsChildren.length > 0) {
    items.push({
      key: 'settings',
      label: t('Navigation.configuration'),
      children: settingsChildren
    });
  }

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
      items={items}
    >
    </Menu>
  );
};

export default Navigation;
