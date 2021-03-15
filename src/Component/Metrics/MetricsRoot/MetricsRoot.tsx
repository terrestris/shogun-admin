import React from 'react';

import { useHistory } from 'react-router-dom';

import {
  Col,
  PageHeader,
  Row
} from 'antd';

import ProcessUptime from '../ProcessUptime/ProcessUptime';
import JdbcConnectionsActive from '../JdbcConnectionsActive/JdbcConnectionsActive';
import JvmMemoryUsed from '../JvmMemoryUsed/JvmMemoryUsed';
import JvmThreadsLive from '../JvmThreadsLive/JvmThreadsLive';
import ProcessCpuUsage from '../ProcessCpuUsage/ProcessCpuUsage';
import SystemCpuCount from '../SystemCpuCount/SystemCpuCount';
import SystemCpuUsage from '../SystemCpuUsage/SystemCpuUsage';
import ProcessStartTime from '../ProcessStartTime/ProcessStartTime';
import SystemLoadAverage from '../SystemLoadAverage/SystemLoadAverage';

import './MetricsRoot.less';

type MetricsRootProps = {};

/**
 * TODO Ideas:
 *
 *  * show link to swagger and graphql
 *  * show link to all other services (e.g. GeoServer) including status (crossing light)
 *
 */

export const MetricsRoot: React.FC<MetricsRootProps> = (props) => {

  const history = useHistory();

  return (
    <div
      className="metrics-root"
    >
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title="Metriken"
        subTitle="… die die Welt vermessen"
      />
      <div className="metrics-card-container">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <JdbcConnectionsActive />
          </Col>
          <Col span={8}>
            <JvmThreadsLive />
          </Col>
          <Col span={8}>
            <JvmMemoryUsed />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <ProcessCpuUsage />
          </Col>
          <Col span={8}>
            <SystemCpuCount />
          </Col>
          <Col span={8}>
            <SystemCpuUsage />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <ProcessStartTime />
          </Col>
          <Col span={8}>
            <ProcessUptime />
          </Col>
          <Col span={8}>
            <SystemLoadAverage />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MetricsRoot;
