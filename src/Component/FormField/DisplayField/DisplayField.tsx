import React from 'react';

import { Typography } from 'antd';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isFinite from 'lodash/isFinite';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import moment from 'moment';

export interface DisplayFieldProps {
  dateFormat?: string;
  format?: 'date' | 'text' | 'json';
  formatFunction?: (val?: any) => string;
  numberOfDigits?: number;
  suffix?: string;
  translationPrefix?: string;
  value?: any;
  valueKey?: string;
}

const DisplayField: React.FC<DisplayFieldProps> = ({
  dateFormat = 'DD.MM.YYYY',
  format = 'text',
  formatFunction,
  numberOfDigits = 2,
  suffix,
  // required for destructuring
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  translationPrefix,
  value,
  valueKey,
  ...passThroughProps
}) => {

  if (_isFunction(formatFunction)) {
    return (
      <Typography.Text
        className="displayfield"
        {...passThroughProps}
      >
        {formatFunction(value)}
      </Typography.Text>
    );
  }

  if (valueKey !== undefined) {
    value = _get(value, valueKey);
  }

  let displayText = value;
  if (format === 'date' && value) {
    displayText = moment(value).format(dateFormat);
  }

  if (format === 'json' && !_isEmpty(value)) {
    displayText = JSON.stringify(value);
  }

  if (Array.isArray(displayText)) {
    displayText = displayText.join(', ');
  }

  const suffixText = !_isNil(displayText) && suffix ? ` ${suffix}` : '';

  if (_isFinite(value)) {
    return (
      <Typography.Text
        className="displayfield"
        {...passThroughProps}
      >
        {`${new Intl.NumberFormat('de-DE').format(Number(value.toFixed(numberOfDigits)))}${suffixText}`}
      </Typography.Text>
    );
  }

  return (
    <Typography.Text
      className="displayfield"
      {...passThroughProps}
    >
      {displayText}{suffixText}
    </Typography.Text>
  );
};

export default DisplayField;
