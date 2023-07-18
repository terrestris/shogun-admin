import React from 'react';

import shogunSpinner from './shogun-spinner.gif';

export interface ShogunSpinnerProps extends Omit<React.ComponentProps<'img'>, 'src'> { };

export const ShogunSpinner: React.FC<ShogunSpinnerProps> = (props) => {
  return (
    <img src={shogunSpinner} alt="shogun spinner" {...props} />
  );
};

export default ShogunSpinner;
