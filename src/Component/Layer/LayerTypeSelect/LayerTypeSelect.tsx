import React, {
  useEffect,
  useState
} from 'react';

import {
  Select
} from 'antd';
import { SelectProps } from 'antd/lib/select';

export enum LayerType {
  TILEWMS = 'TILEWMS',
  VECTORTILE = 'VECTORTILE',
  WFS = 'WFS',
  WMS = 'WMS',
  WMTS = 'WMTS',
  XYZ = 'XYZ',
  WMSTime = 'WMSTime',
}

type SelectPropsExcludes = 'defaultValue' | 'value' | 'options' | 'onChange';

export interface LayerTypeSelectProps extends Omit<SelectProps<LayerType>, SelectPropsExcludes> {
  value?: LayerType;
  onChange?: (value: string) => void;
};

export const LayerTypeSelect: React.FC<LayerTypeSelectProps> = ({
  value,
  onChange,
  ...passThroughProps
}) => {

  const [currentValue, setCurrentValue] = useState<LayerType>(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const getOptions = (): any[] => {
    const options = [];

    for (const value in LayerType) {
      options.push({
        label: value,
        value: value
      });
    }

    return options;
  };

  const changeHandler = (value: LayerType) => {
    setCurrentValue(value);

    onChange(value);
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
