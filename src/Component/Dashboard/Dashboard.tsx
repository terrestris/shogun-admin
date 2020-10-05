import React, { ReactNode } from 'react';

import './Dashboard.less';

interface OwnProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  actions?: ReactNode;
  icon?: string;
  columns?: number;
  rows?: number;
  title?: ReactNode;
}

type DashoardProps = OwnProps;

export const Dashboard: React.FC<DashoardProps> = (props) => {

  const {
    actions,
    icon,
    className,
    children,
    columns = 2,
    rows,
    title,
    ...passThrpughProps
  } = props;

  const gridTemplateColumns = `repeat(${columns}, 1fr)`;

  return (
    <div
      className={`dashboard ${className ? className : ''}`}
      {...passThrpughProps}
    >
      <div className="header">
        {
          icon &&
          <img className="icon" src={icon} alt={`${title} icon`}/>
        }
        <div className="title">
          {title}
        </div>
        <div className="actions">
          {actions}
        </div>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns
        }}
      >
        {children}
      </div>
    </div>
  );
};
