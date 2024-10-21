import './YesOrNoField.less';

import React from 'react';

import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';
import {
  useTranslation
} from 'react-i18next';

export interface YesOrNoFieldProps {
  value?: boolean;
  showIcons?: boolean;
}

const YesOrNoField: React.FC<YesOrNoFieldProps> = ({
  showIcons = true,
  value
}) => {

  const {
    t
  } = useTranslation();

  return (
    value ? (
      <div className="yes-no-field">
        <span className="yn-text">{t('YesOrNoField.yes')}</span>
        {showIcons && <CheckOutlined />}
      </div>
    ): (
      <div className="yes-no-field">
        <span className="yn-text">{t('YesOrNoField.no')}</span>
        {showIcons && <CloseOutlined /> }
      </div>
    )
  );
};

export default YesOrNoField;
