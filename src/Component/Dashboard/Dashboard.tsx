import React, {
  ReactNode
} from 'react';

// import usePlugins from '../../Hooks/usePlugins';

import './Dashboard.less';

interface OwnProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  actions?: ReactNode;
  icon?: string;
  columns?: number;
  rows?: number;
  title?: ReactNode;
}

type DashboardProps = OwnProps;

export const Dashboard: React.FC<DashboardProps> = (props) => {

  const {
    actions,
    icon,
    className,
    children,
    columns = 2,
    // required for destructuring
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rows,
    title,
    ...passThroughProps
  } = props;

  // const plugins = usePlugins();

  // console.log(apply)
  // Util.toString()
  // console.log(plugins)

  // const PluginComponent = plugins[0].wrappedComponent;

  const gridTemplateColumns = `repeat(${columns}, 1fr)`;

  return (
    <div
      className={`dashboard ${className ? className : ''}`}
      {...passThroughProps}
    >
      <div className="header">
        {/* <ExamplePlugin /> */}
        {
          icon &&
          <img className="icon" src={icon} alt={`${title} icon`} />
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
