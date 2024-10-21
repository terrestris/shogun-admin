import React, {
  useEffect,
  useState
} from 'react';

import {
  Select
} from 'antd';
import { SelectProps } from 'antd/lib/select';

import { LayerType } from '@terrestris/shogun-util/dist/model/enum/LayerType';

type SelectPropsExcludes = 'defaultValue' | 'value' | 'options' | 'onChange';

export interface LayerTypeSelectProps extends Omit<SelectProps<LayerType>, SelectPropsExcludes> {
  supportedTypes?: LayerType[];
  value?: LayerType;
  onChange?: (value?: LayerType) => void;
}

export const LayerTypeSelect: React.FC<LayerTypeSelectProps> = ({
  supportedTypes = [
    'TILEWMS',
    'VECTORTILE',
    'WFS',
    'WMS',
    'WMSTIME',
    'WMTS',
    'XYZ'
  ],
  value,
  onChange = () => undefined,
  ...passThroughProps
}) => {

  const [currentValue, setCurrentValue] = useState<LayerType | undefined>(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const getOptions = (): any[] => {
    const options = [];

    for (const supportedType of supportedTypes) {
      options.push({
        label: supportedType,
        value: supportedType
      });
    }

    return options;
  };

  const changeHandler = (val: LayerType) => {
    setCurrentValue(val);
    onChange(val);
  };

  return (
    <Select
      defaultValue={currentValue}
      value={currentValue}
      options={getOptions()}
      onChange={changeHandler}
      {...passThroughProps}
    />
  );
};

export default LayerTypeSelect;
