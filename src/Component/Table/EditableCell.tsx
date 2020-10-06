import React from 'react';
import {
  Form,
  Input,
  Checkbox,
  InputNumber,
  Select
} from 'antd';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  dataType: string;
  record: any;
  index: number;
  children: React.ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  dataType,
  record,
  index,
  children,
  ...restProps
}) => {

  let input;
  let valuePropName;
  let getValueFromEvent;
  switch (dataType) {
    case 'string':
      input = <Input autoComplete="new-password" />;
      valuePropName = 'value';
      getValueFromEvent = evt => evt.target.value;
      break;
    case 'number':
      input = <InputNumber autoComplete="new-password" />;
      valuePropName = 'value';
      getValueFromEvent = evt => evt.target.value;
      break;
    case 'boolean':
      input = <Checkbox />;
      valuePropName = 'checked';
      getValueFromEvent = evt => evt.target.checked;
      break;
    case 'dataType':
      input = (
        <Select defaultValue="VARCHAR">
          <Select.Option value="VARCHAR">VARCHAR</Select.Option>
          <Select.Option value="TIMESTAMP">TIMESTAMP</Select.Option>
          <Select.Option value="INTEGER">INTEGER</Select.Option>
          <Select.Option value="LONG">LONG</Select.Option>
          <Select.Option value="DATE">DATE</Select.Option>
          <Select.Option value="TIME">TIME</Select.Option>
        </Select>
      );
      valuePropName = 'value';
      getValueFromEvent = value => value;
      break;
    case 'weekdays':
      input = (
        <Select mode="multiple">
          <Select.Option value="Monday">Montag</Select.Option>
          <Select.Option value="Tuesday">Dienstag</Select.Option>
          <Select.Option value="Wednesday">Mittwoch</Select.Option>
          <Select.Option value="Thursday">Donnerstag</Select.Option>
          <Select.Option value="Friday">Freitag</Select.Option>
          <Select.Option value="Saturday">Samstag</Select.Option>
          <Select.Option value="Sunday">Sonntag</Select.Option>
        </Select>
      );
      valuePropName = 'value';
      getValueFromEvent = value => value;
      break;
    default:
      input = <Input autoComplete="new-password" />;
      valuePropName = 'value';
      getValueFromEvent = evt => evt.target.value;
      break;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          valuePropName={valuePropName}
          getValueFromEvent={getValueFromEvent}
        >
          {input}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
