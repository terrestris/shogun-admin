import React from 'react';

import {
  Tooltip,
  TooltipProps
} from 'antd';

import _get from 'lodash/get';

import { LinkOutlined } from '@ant-design/icons';

import './LinkField.less';

export type LinkFieldProps = {
  value: any;
  valuePath?: string;
  template?: string;
} & Partial<TooltipProps>;

export const LinkField: React.FC<LinkFieldProps> = ({
  value,
  valuePath,
  template = '{}',
  title = 'Öffne Link',
  ...passThroughProps
}): JSX.Element => {

  const onClick = () => {
    const link = template.replace(/{}/g, valuePath ? _get(value, valuePath) : value);
    window.open(link, '_blank');
  };

  return (
    <Tooltip
      title={title}
      {...passThroughProps}
    >
      <div
        className="link-wrapper"
      >
        <LinkOutlined
          onClick={onClick}
        />
      </div>
    </Tooltip>
  );
};

export default LinkField;
