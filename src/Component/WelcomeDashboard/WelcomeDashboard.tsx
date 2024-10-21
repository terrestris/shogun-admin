import './WelcomeDashboard.less';

import React from 'react';

import {
  AppstoreOutlined,
  BankOutlined,
  DashboardOutlined,
  LikeOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Col,
  Row,
  Statistic
} from 'antd';
import _isNil from 'lodash/isNil';
import {
  useTranslation
} from 'react-i18next';
import { Link } from 'react-router-dom';
import config from 'shogunApplicationConfig';

import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';
import { Dashboard } from '../Dashboard/Dashboard';
import { DashboardCard } from '../Dashboard/DashboardCard/DashboardCard';
import DashboardStatistics from '../Dashboard/DashboardStatistics/DashboardStatistics';

interface WelcomeDashboardProps {}

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = () => {
  const {
    t
  } = useTranslation();

  const dashboardConf = config.dashboard;

  const client = useSHOGunAPIClient();

  if (_isNil(client)) {
    return null;
  }

  return (
    <Dashboard
      className="welcome-dashboard"
      title={'Dashboard'}
      columns={3}
    >
      {
        dashboardConf?.statistics?.visible &&
        <DashboardCard
          className="statistics-dashboard-card"
          title="Statistiken"
          description="… wie siehts denn aus"
          avatar={<DashboardOutlined />}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
            </Col>
            <Col span={12}>
              <Statistic title="Unmerged" value={93} suffix="/ 100" />
            </Col>
          </Row>
        </DashboardCard>
      }
      {
        dashboardConf?.applications?.visible &&
        <Link to={`${config.appPrefix}/portal/application`}>
          <DashboardCard
            className="layer-dashboard-card"
            title={t('WelcomeDashboard.applications')}
            description={t('WelcomeDashboard.applicationInfo')}
            avatar={<BankOutlined />}
          >
            <DashboardStatistics
              service={client.application()}
              name={{
                singular: t('WelcomeDashboard.applicationSingular'),
                plural: t('WelcomeDashboard.applicationPlural')
              }}
            />
          </DashboardCard>
        </Link>
      }
      {
        dashboardConf?.layers?.visible &&
        <Link to={`${config.appPrefix}/portal/layer`}>
          <DashboardCard
            className="layer-dashboard-card"
            title={t('WelcomeDashboard.layer')}
            description={t('WelcomeDashboard.layerInfo')}
            avatar={<AppstoreOutlined />}
          >
            <DashboardStatistics
              service={client.layer()}
              name={{
                singular: t('WelcomeDashboard.layerSingluar'),
                plural: t('WelcomeDashboard.layerPlural')
              }}
            />
          </DashboardCard>
        </Link>
      }
      {
        dashboardConf?.users?.visible &&
        <Link to={`${config.appPrefix}/portal/user`}>
          <DashboardCard
            className="layer-dashboard-card"
            title={t('WelcomeDashboard.user')}
            description={t('WelcomeDashboard.userInfo')}
            avatar={<UserOutlined />}
          >
            <DashboardStatistics
              service={client.user()}
              name={{
                singular: t('WelcomeDashboard.userSingular'),
                plural: t('WelcomeDashboard.userPlural')
              }}
            />
          </DashboardCard>
        </Link>
      }
    </Dashboard>
  );
};


export default WelcomeDashboard;
