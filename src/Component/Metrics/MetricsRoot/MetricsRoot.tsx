import './MetricsRoot.less';

import React from 'react';

import {
  Col,
  PageHeader,
  Row
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import JdbcConnectionsActive from '../JdbcConnectionsActive/JdbcConnectionsActive';
import JvmMemoryUsed from '../JvmMemoryUsed/JvmMemoryUsed';
import JvmThreadsLive from '../JvmThreadsLive/JvmThreadsLive';
import ProcessCpuUsage from '../ProcessCpuUsage/ProcessCpuUsage';
import ProcessStartTime from '../ProcessStartTime/ProcessStartTime';
import ProcessUptime from '../ProcessUptime/ProcessUptime';
import SystemCpuCount from '../SystemCpuCount/SystemCpuCount';
import SystemCpuUsage from '../SystemCpuUsage/SystemCpuUsage';
import SystemLoadAverage from '../SystemLoadAverage/SystemLoadAverage';

type MetricsRootProps = {};

/**
 * TODO Ideas:
 *
 *  * show link to swagger and graphql
 *  * show link to all other services (e.g. GeoServer) including status (crossing light)
 *
 */

export const MetricsRoot: React.FC<MetricsRootProps> = (props) => {

  const navigate = useNavigate();

  const {
    t
  } = useTranslation();

  return (
    <div
      className="metrics-root"
    >
      <PageHeader
        className="header"
        onBack={() => navigate(-1)}
        title={t('Metrics.title')}
        subTitle={t('Metrics.info')}
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
