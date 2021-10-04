import React from 'react';

import { Link } from 'react-router-dom';

import {
  Col,
  Row,
  Statistic,
  List
} from 'antd';

import Avatar from 'antd/lib/avatar/avatar';

import {
  AppstoreOutlined,
  DashboardOutlined,
  LikeOutlined,
  MailOutlined,
  UserOutlined
} from '@ant-design/icons';

import { Dashboard } from '../Dashboard/Dashboard';
import { DashboardCard } from '../Dashboard/DashboardCard/DashboardCard';
import LayerTable from '../Layer/LayerTable/LayerTable';
import UserTable from '../User/UserTable/UserTable';

import config from 'shogunApplicationConfig';

import './WelcomeDashboard.less';

type WelcomeDashboardProps = {};

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = (props) => {

  const dashboardConf = config.dashboard;

  return (
    <Dashboard
      className="welcome-dashboard"
      title={'Dashboard'}
      columns={3}
    >
      {
        dashboardConf?.news?.visible &&
          <DashboardCard
            className="news-dashboard-card"
            title="Nachrichten"
            description="… was habe ich verpasst"
            avatar={<MailOutlined />}
            hoverable={false}
          >
            <List
              itemLayout="horizontal"
              dataSource={[]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={<a href="https://ant.design">{item.title}</a>}
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                </List.Item>
              )}
            />
          </DashboardCard>
      }
      {
        dashboardConf?.statistics?.visible &&
          <DashboardCard
            className="statistics-dashboard-card"
            title="Statistiken"
            description="… wie siehts denn aus"
            avatar={<DashboardOutlined />}
            hoverable={false}
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
        dashboardConf?.layers?.visible &&
          <DashboardCard
            className="layer-dashboard-card"
            title={<Link to={`${config.appPrefix}/portal/layer`}>Themen</Link>}
            description="… die die Welt bewegen"
            avatar={<Link to={`${config.appPrefix}/portal/layer`}><AppstoreOutlined /></Link>}
          >
            <LayerTable />
          </DashboardCard>
      }
      {
        dashboardConf?.users?.visible &&
          <DashboardCard
            className="layer-dashboard-card"
            title={<Link to={`${config.appPrefix}/portal/user`}>User</Link>}
            description="… die die Welt verbessern"
            avatar={<Link to={`${config.appPrefix}/portal/user`}><UserOutlined /></Link>}
          >
            <UserTable />
          </DashboardCard>
      }
    </Dashboard>
  );
};


export default WelcomeDashboard;
