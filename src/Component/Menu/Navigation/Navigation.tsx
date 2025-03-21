import React from 'react';

import {
  BankOutlined,
  BarChartOutlined,
  ControlOutlined,
  FileImageOutlined,
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  TagOutlined,
  ApiOutlined,
  BranchesOutlined
} from '@ant-design/icons';

import {
  Menu
} from 'antd';
import { ItemType } from 'antd/lib/menu/interface';
import _isNil from 'lodash/isNil';
import { SelectInfo } from 'rc-menu/lib/interface';
import {
  useTranslation
} from 'react-i18next';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import config from 'shogunApplicationConfig';

import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import TranslationUtil from '../../../Util/TranslationUtil';
import { GeneralEntityConfigType } from '../../GeneralEntity/GeneralEntityRoot/GeneralEntityRoot';

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
  const client = useSHOGunAPIClient();

  const onSelect = ({ key }: SelectInfo) => {
    navigate(`${config.appPrefix}/portal/${key}`);
  };

  const match = matchPath({
    path: `${config.appPrefix}/portal/:activeKey`
  }, location.pathname);

  const activeKey = match?.params?.activeKey;

  const navigationConf = config.navigation;

  const navigationContentChildren: ItemType[] = [];

  if (entityConfigs && entityConfigs.length > 0) {
    // The following entities are the "default" SHOGun ones.
    const applicationConfig = entityConfigs.find(e => e.entityType === 'application');
    const layersConfig = entityConfigs.find(e => e.entityType === 'layer');
    const userConfig = entityConfigs.find(e => e.entityType === 'user');
    const groupsConfig = entityConfigs.find(e => e.entityType === 'group');
    const rolesConfig = entityConfigs.find(e => e.entityType === 'role');

    // But it's also possible to add custom entities to the navigation.
    const otherConfigs = entityConfigs.filter(e => ![
      applicationConfig,
      layersConfig,
      userConfig,
      groupsConfig,
      rolesConfig
    ].includes(e));

    if (applicationConfig) {
      navigationContentChildren.push({
        key: 'application',
        label: (
          <>
            <BankOutlined />
            <span>
              {TranslationUtil.getTranslationFromConfig(applicationConfig?.navigationTitle, applicationConfig?.i18n)}
            </span>
          </>
        )
      });
    }
    if (layersConfig) {
      navigationContentChildren.push({
        key: 'layer',
        label: (
          <>
            <AppstoreOutlined />
            <span>
              {TranslationUtil.getTranslationFromConfig(layersConfig?.navigationTitle, layersConfig?.i18n)}
            </span>
          </>
        )
      });
    }
    if (userConfig) {
      navigationContentChildren.push({
        key: 'user',
        label: (
          <>
            <UserOutlined />
            <span>
              {TranslationUtil.getTranslationFromConfig(userConfig?.navigationTitle, userConfig?.i18n)}
            </span>
          </>
        )
      });
    }
    if (groupsConfig) {
      navigationContentChildren.push({
        key: 'group',
        label: (
          <>
            <TeamOutlined />
            <span>
              {TranslationUtil.getTranslationFromConfig(groupsConfig?.navigationTitle, groupsConfig?.i18n)}
            </span>
          </>
        )
      });
    }
    if (rolesConfig) {
      navigationContentChildren.push({
        key: 'role',
        label: (
          <>
            <TagOutlined />
            <span>
              {TranslationUtil.getTranslationFromConfig(rolesConfig?.navigationTitle, rolesConfig?.i18n)}
            </span>
          </>
        )
      });
    }
    otherConfigs.forEach(entityConfig => {
      navigationContentChildren.push({
        key: entityConfig.entityType,
        label: (
          <>
            {/* TODO We might think about making the icon configurable */}
            <ApiOutlined />
            <span>
              {TranslationUtil.getTranslationFromConfig(entityConfig?.navigationTitle, entityConfig?.i18n)}
            </span>
          </>
        )
      });
    });
  }

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
          <span>{t('Navigation.logLevels')}</span>
        </>
      )
    });
  }

  if (navigationConf?.settings?.graphiql?.visible) {
    settingsChildren.push({
      key: 'graphiql',
      icon: <BranchesOutlined />,
      label: (
        <>
          <a href={`${client?.getBasePath()}graphiql?path=/graphql`} target='_blank' rel='noopener noreferrer'>
            <span>{t('Navigation.graphiql')}</span>
          </a>
        </>
      )
    });
  }
  if (navigationConf?.settings?.swagger?.visible) {
    settingsChildren.push({
      key: 'swagger',
      icon: <ApiOutlined />,
      label: (
        <>
          <a href={`${client?.getBasePath()}swagger-ui/index.html`} target='_blank' rel='noopener noreferrer'>
            <span>{t('Navigation.swagger')}</span>
          </a>
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
      selectedKeys={!_isNil(activeKey) ? [activeKey] : []}
      defaultOpenKeys={['general']}
      items={items}
    >
    </Menu>
  );
};

export default Navigation;
