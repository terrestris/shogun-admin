import React from 'react';

import { Link } from 'react-router-dom';

import {
  Col,
  Row,
  Statistic
} from 'antd';

import {
  useTranslation
} from 'react-i18next';

import {
  AppstoreOutlined,
  BankOutlined,
  DashboardOutlined,
  LikeOutlined,
  UserOutlined
} from '@ant-design/icons';

import { Dashboard } from '../Dashboard/Dashboard';
import { DashboardCard } from '../Dashboard/DashboardCard/DashboardCard';

import config from 'shogunApplicationConfig';

import DashboardStatistics from '../Dashboard/DashboardStatistics/DashboardStatistics';

import './WelcomeDashboard.less';
import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

type WelcomeDashboardProps = {};

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = () => {
  const {
    t
  } = useTranslation();

  const dashboardConf = config.dashboard;

  const client = useSHOGunAPIClient();

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
            title={t('WelcomeDashboard.subject')}
            description={t('WelcomeDashboard.subjectInfo')}
            avatar={<AppstoreOutlined />}
          >
            <DashboardStatistics
              service={client.layer()}
              name={{
                singular: t('WelcomeDashboard.subjectSingluar'),
                plural: t('WelcomeDashboard.subjectPlural')
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
                plural: t('WelcomeDashboard:.userPlural')
              }}
            />
          </DashboardCard>
        </Link>
      }
    </Dashboard>
  );
};


export default WelcomeDashboard;
