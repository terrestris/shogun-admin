import React from 'react';
import { Link } from 'react-router-dom';

import './WelcomeDashboard.less';

import {
  AppstoreOutlined,
  BankOutlined,
  DashboardOutlined,
  LikeOutlined,
  MailOutlined,
  UnorderedListOutlined,
  UserOutlined
} from '@ant-design/icons';

import { Col, Row, Statistic, List } from 'antd';
import { Dashboard } from '../Dashboard/Dashboard';
import { DashboardCard } from '../Dashboard/DashboardCard/DashboardCard';
import ApplicationTable from '../Application/ApplicationTable/ApplicationTable';
import Avatar from 'antd/lib/avatar/avatar';

type WelcomeDashboardProps = {};

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = (props) => {

  return (
    <Dashboard
      className="welcome-dashboard"
      title={'Dashboard'}
      columns={3}
    >
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
      <DashboardCard
        className="application-dashboard-card"
        title={<Link to={'/portal/logs'}>Logs</Link>}
        description="… die die Welt erklären"
        avatar={<Link to={'/portal/logs'}><UnorderedListOutlined /></Link>}
      >
        {/* <UserProfileForm /> */}
      </DashboardCard>
      <DashboardCard
        className="application-dashboard-card"
        title={<Link to={'/portal/application'}>Applikationen</Link>}
        description="… die die Welt verändern"
        avatar={<Link to={'/portal/application'}><BankOutlined /></Link>}
      >
        <ApplicationTable
          disableActions={true}
        />
      </DashboardCard>
      <DashboardCard
        className="layer-dashboard-card"
        title={<Link to={'/portal/layer'}>Themen</Link>}
        description="… die die Welt bewegen"
        avatar={<Link to={'/portal/layer'}><AppstoreOutlined /></Link>}
      >
        {/* <UserProfileForm /> */}
      </DashboardCard>
      <DashboardCard
        className="layer-dashboard-card"
        title={<Link to={'/portal/user'}>User</Link>}
        description="… die die Welt verbessern"
        avatar={<Link to={'/portal/user'}><UserOutlined /></Link>}
      >
        {/* <UserProfileForm /> */}
      </DashboardCard>
    </Dashboard>
  );
};


export default WelcomeDashboard;
