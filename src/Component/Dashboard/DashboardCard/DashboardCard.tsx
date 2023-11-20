import './DashboardCard.less';

import React, { ReactNode } from 'react';

import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';

interface OwnProps extends CardProps {
  actions?: ReactNode[];
  avatar?: ReactNode;
  description?: ReactNode;
  title?: ReactNode;
  hoverable?: boolean;
}

type DashboardCardProps = OwnProps;

export const DashboardCard: React.FC<DashboardCardProps> = (props) => {

  const {
    className,
    actions,
    avatar,
    children,
    description,
    hoverable = false,
    title,
    ...passThroughProps
  } = props;

  return (
    <Card
      {...passThroughProps}
      className={`dashboard-card ${hoverable ? 'hoverable' : ''} ${className ? className : ''}`}
      actions={actions}
    >
      <Card.Meta
        avatar={avatar}
        title={title}
        description={description}
      />
      <div className="dashboard-card-body">
        {children}
      </div>
    </Card>
  );
};
