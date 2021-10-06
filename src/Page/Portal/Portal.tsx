import React, { useState } from 'react';

import { Button } from 'antd';
import { Switch, Route } from 'react-router-dom';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

import Navigation from '../../Component/Menu/Navigation/Navigation';
import LayerRoot from '../../Component/Layer/LayerRoot/LayerRoot';
import WelcomeDashboard from '../../Component/WelcomeDashboard/WelcomeDashboard';
import UserProfile from '../../Component/Modal/UserProfile/UserProfile';
import ApplicationInfo from '../../Component/Modal/ApplicationInfo/ApplicationInfo';

import UserRoot from '../../Component/User/UserRoot/UserRoot';
import ImageFileRoot from '../../Component/ImageFile/ImageFileRoot/ImageFileRoot';
import Logs from '../../Component/Logs/Logs';
import GlobalSettingsRoot from '../../Component/GlobalSettings/GlobalSettingsRoot/GlobalSettingsRoot';
import LogSettingsRoot from '../../Component/LogSettings/LogSettingsRoot/LogSettingsRoot';
import MetricsRoot from '../../Component/Metrics/MetricsRoot/MetricsRoot';

import config from 'shogunApplicationConfig';

import './Portal.less';
import GeneralEntityRoot,
{ GeneralEntityConfigType } from '../../Component/GeneralEntity/GeneralEntityRoot/GeneralEntityRoot';

interface OwnProps { }

type PortalProps = OwnProps;

export const Portal: React.FC<PortalProps> = () => {

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  const entitiesToLoad: GeneralEntityConfigType[] = [{
    endpoint: 'applications',
    entityType: 'application',
    entityName: 'Applikation',
    navigationTitle: 'Applikationen',
    subTitle: 'die meiste Applikation aller Zeiten...',
    formConfig: {
      name: 'application',
      fields: [{
        dataType: 'number',
        dataField: 'id',
        labelI18n: 'Identifier',
        readOnly: true
      }, {
        dataField: 'created',
        dataType: 'date',
        readOnly: true,
        component: 'DateField',
        labelI18n: 'Erstellt am',
        fieldProps: {
          dateFormat: 'DD.MM.YYYY HH:mm'
        }
      }, {
        dataField: 'modified',
        dataType: 'date',
        readOnly: true,
        labelI18n: 'Editiert am',
        component: 'DateField',
        fieldProps: {
          dateFormat: 'DD.MM.YYYY HH:mm'
        }
      }, {
        component: 'Input',
        dataField: 'name',
        labelI18n: 'Der Name der Applikation',
        required: true
      }, {
        component: 'Switch',
        dataField: 'stateOnly',
        labelI18n: 'Arbeitstand',
        readOnly: true
      }, {
        component: 'JSONEditor',
        dataField: 'clientConfig',
        labelI18n: 'Client-Konfiguration'
      }, {
        component: 'JSONEditor',
        dataField: 'layerTree',
        labelI18n: 'Themen-Baum'
      }, {
        component: 'JSONEditor',
        dataField: 'layerConfig',
        labelI18n: 'Themen-Konfiguration'
      }]
    }
  }];

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
          {
            entitiesToLoad.map(entityConfig => <Route
              key={entityConfig.endpoint}
              path={`${config.appPrefix}/portal/${entityConfig?.entityType}`}
              render={() => <GeneralEntityRoot
                {...entityConfig}
              />}
            />)
          }
          <Route
            path={`${config.appPrefix}/portal/layer`}
            component={LayerRoot}
          />
          <Route
            path={`${config.appPrefix}/portal/user`}
            component={UserRoot}
          />
          <Route
            path={`${config.appPrefix}/portal/imagefile`}
            component={ImageFileRoot}
          />
          <Route
            path={`${config.appPrefix}/portal/status/metrics`}
            component={MetricsRoot}
          />
          <Route
            path={`${config.appPrefix}/portal/status/logs`}
            component={Logs}
          />
          <Route
            path={`${config.appPrefix}/portal/settings/global`}
            component={GlobalSettingsRoot}
          />
          <Route
            path={`${config.appPrefix}/portal/settings/logs`}
            component={LogSettingsRoot}
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
