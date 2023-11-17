import './LinkField.less';

import { LinkOutlined } from '@ant-design/icons';
import {
  Tooltip,
  TooltipProps
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TranslationUtil from '../../../Util/TranslationUtil';

export type LinkFieldProps = {
  title?: string;
  i18n?: FormTranslations;
  value: string;
  template?: string;
} & Partial<TooltipProps>;

export const LinkField: React.FC<LinkFieldProps> = ({
  i18n,
  value,
  template = '{}',
  title = '',
  ...passThroughProps
}): JSX.Element => {

  const {
    t
  } = useTranslation();

  const onClick = () => {
    const link = template.replace(/{}/g, value);
    window.open(link, '_blank');
  };

  return (
    <Tooltip
      title={title ? TranslationUtil.getTranslationFromConfig(title, i18n) : t('LinkField.title')}
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
