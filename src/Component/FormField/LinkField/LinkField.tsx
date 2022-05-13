import React from 'react';

import {
  Tooltip,
  TooltipProps
} from 'antd';

import { LinkOutlined } from '@ant-design/icons';

import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import _isFinite from 'lodash/isFinite';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import './LinkField.less';

export type LinkFieldProps = {
  value: string;
  template?: string;
} & Partial<TooltipProps>;

export const LinkField: React.FC<LinkFieldProps> = ({
  value,
  template = '{}',
  title = 'Öffne Link',
  ...passThroughProps
}): JSX.Element => {

  const onClick = () => {
    const link = template.replace(/{}/g, value);
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
