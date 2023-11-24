import React from 'react';

import {
  ExclamationCircleOutlined
} from '@ant-design/icons';

import {
  Tooltip,
  TooltipProps
} from 'antd';

import {
  useTranslation
} from 'react-i18next';

import Group from '@terrestris/shogun-util/dist/model/Group';
import User from '@terrestris/shogun-util/dist/model/User';

import TranslationUtil from '../../../Util/TranslationUtil';

import './VerifyProviderDetailsField.less';

export type VerifyProviderDetailsFieldProps = {
  record: User | Group;
  value?: string;
  i18n?: FormTranslations;
  title?: string;
} & Partial<Omit<TooltipProps, 'title'>>;

export const VerifyProviderDetailsField: React.FC<VerifyProviderDetailsFieldProps> = ({
  record,
  value,
  i18n,
  title,
  ...passThroughProps
}): JSX.Element => {

  const {
    t
  } = useTranslation();

  if (!record.providerDetails) {
    return (
      <>
        <>{value}</>
        <Tooltip
          title={title ? TranslationUtil.getTranslationFromConfig(title, i18n) : t('VerifyProviderDetailsField.title')}
          {...passThroughProps}
        >
          <ExclamationCircleOutlined
            className='provider-details-warning'
          />
        </Tooltip>
      </>
    );
  }

  return (<>{value}</>);
};

export default VerifyProviderDetailsField;
