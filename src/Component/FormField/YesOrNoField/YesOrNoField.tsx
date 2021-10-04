import React from 'react';
import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';

import './YesOrNoField.less';

export type YesOrNoFieldProps = {
  value?: boolean;
  showIcons?: boolean;
};

const YesOrNoField: React.FC<YesOrNoFieldProps> = ({
  showIcons = true,
  value
}) => {

  return (
    value ? <div className="yes-no-field">
      <span className="yn-text">Yes</span>
      {showIcons && <CheckOutlined />}
    </div> : <div className="yes-no-field">
      <span className="yn-text">No</span>
      {showIcons &&<CloseOutlined /> }
    </div>
  );
};

export default YesOrNoField;
