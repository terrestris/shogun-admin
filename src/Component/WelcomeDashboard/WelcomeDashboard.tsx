import React from 'react';

import { Link } from 'react-router-dom';

import {
  Col,
  Row,
  Statistic
} from 'antd';

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
import ApplicationService from '../../Service/ApplicationService/ApplicationService';
import LayerService from '../../Service/LayerService/LayerService';
import UserService from '../../Service/UserService/UserService';

import './WelcomeDashboard.less';

type WelcomeDashboardProps = {};

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = () => {

  const dashboardConf = config.dashboard;

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
            title="Applikationen"
            description="… die die Welt bewegen"
            avatar={<BankOutlined />}
          >
            <DashboardStatistics
              service={new ApplicationService(config.path.application)}
              name={{
                singular: 'Applikation',
                plural: 'Applikationen'
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
            title="Themen"
            description="… die die Welt bewegen"
            avatar={<AppstoreOutlined />}
          >
            <DashboardStatistics
              service={new LayerService(config.path.user)}
              name={{
                singular: 'Thema',
                plural: 'Themen'
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
            title="User"
            description="… die die Welt verbessern"
            avatar={<UserOutlined />}
          >
            <DashboardStatistics
              service={new UserService(config.path.layer)}
              name={{
                singular: 'Benutzer',
                plural: 'Benutzer'
              }}
            />
          </DashboardCard>
        </Link>
      }
    </Dashboard>
  );
};


export default WelcomeDashboard;
