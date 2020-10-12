import React from 'react';

type DisplayFieldProps = {
  value?: string;
  formatter?: (value?: string) => string;
};

export const DisplayField: React.FC<DisplayFieldProps> = ({
  value,
  formatter = (val => val)
}) => {

  return (<span>{formatter(value)}</span>);
};

export default DisplayField;
