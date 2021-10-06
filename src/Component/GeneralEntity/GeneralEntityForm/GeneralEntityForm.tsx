import React from 'react';

import { DatePicker, Form, Input, Statistic, Switch } from 'antd';
const { TextArea } = Input;

import Logger from 'js-logger';

import DisplayField from '../../FormField/DisplayField/DisplayField';
import { FormInstance, FormItemProps, FormProps } from 'antd/lib/form';
import YesOrNoField from '../../FormField/YesOrNoField/YesOrNoField';
import JSONEditor from '../../FormField/JSONEditor/JSONEditor';

export type FieldConfig = {
  component?: string;
  dataField: string;
  dataType?: string;
  fieldProps?: {
    [key: string]: any;
  };
  formItemProps?: {
    [key: string]: any;
  };
  labelI18n?: string;
  noOptionValue?: {
    value: string;
  };
  normalizer?: {
    value: string;
  };
  required?: boolean;
  requiredI18n?: string;
  readOnly?: boolean;
};

export type FormMode = 'EDIT' | 'VIEW';

export type FormConfig = {
  name: string;
  fields: FieldConfig[];
};

interface OwnProps {
  id?: number | 'create';
  formConfig: FormConfig;
  formProps?: Partial<FormProps>;
  form: FormInstance;
};

const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';

export type GeneralEntityFormProps = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export const GeneralEntityForm: React.FC<GeneralEntityFormProps> = ({
  formProps,
  form,
  formConfig
}) => {

  /**
   * Create read-only components for certain form items
   * @param fieldConfig
   * @returns
   */
  const createReadOnlyComponent = (fieldConfig: FieldConfig): React.ReactNode => {
    switch (fieldConfig.component) {
      case 'Switch':
        return (<YesOrNoField />);
      case 'Statistic':
        return createFieldComponent(fieldConfig);
      case 'DateField':
        return <DisplayField
          format="date"
          {...fieldConfig.fieldProps}
        />;
      default:
        return (
          <DisplayField
            {...fieldConfig.fieldProps}
          />
        );
    }
  };

  /**
   * Return a component given the "component" property in passed field configuration
   * @param fieldConfig The field configuration
   */
  const createFieldComponent = (fieldCfg: FieldConfig): React.ReactNode => {
    switch (fieldCfg?.component) {
      case 'TextArea':
        return (
          <TextArea
            {...fieldCfg?.fieldProps}
          />
        );
      case 'Input':
        return (
          <Input
            {...fieldCfg?.fieldProps}
          />
        );
      // case 'InputNumberAutoSelect':
      //   return (
      //     <InputNumberAutoSelect
      //       {...fieldConfig.fieldProps}
      //     />
      //   );
      case 'Switch':
        return (
          <Switch
            checkedChildren="On"
            unCheckedChildren="Off"
            {...fieldCfg?.fieldProps}
          />
        );
      case 'Statistic':
        return (
          <Statistic {...fieldCfg?.fieldProps} />
        );
      case 'JSONEditor':
        return (
          <JSONEditor {...fieldCfg?.fieldProps} />
        );
      case 'DisplayField':
        return (
          <DisplayField {...fieldCfg?.fieldProps} />
        );
      case 'DateField':
        return (
          <DatePicker
            format={DEFAULT_DATE_FORMAT}
            {...fieldCfg?.fieldProps}
          />
        );
      default:
        Logger.error(`Cannot create component of type "${fieldCfg?.component}" with name "${fieldCfg?.dataField}"`);
        return null;
    }
  };

  /**
   * Return a component given the "datatype" property passed field configuration
   * @param fieldConfig The field configuration
   */
  const getFieldByDataType = (fieldConfig: FieldConfig): React.ReactNode => {
    return (
      <Input
        {...fieldConfig?.fieldProps}
      />
    );
  };

  /**
   * Generates an antd normalize function with the specified "no"-value.
   */
  const getNormalizeFn = (name: string) => {
    let noValue: string = '';
    return (value, prevValue = []) => {
      if (
        Array.isArray(value) &&
        Array.isArray(prevValue) &&
        value.indexOf(noValue) >= 0 &&
        prevValue.indexOf(noValue) < 0
      ) {
        return [noValue];
      }
      return value;
    };
  };

  /**
   * Generate antd form item for given field config
   * @param fieldCfg The FieldConfig
   * @returns An antd FormItem
   */
  const createFormItem = (fieldCfg: FieldConfig): React.ReactNode => {
    let field: React.ReactNode;
    if (fieldCfg.readOnly) {
      field = createReadOnlyComponent(fieldCfg);
    } else if (fieldCfg.component) {
      field = createFieldComponent(fieldCfg);
    } else if (fieldCfg.dataType) {
      field = getFieldByDataType(fieldCfg);
    } else {
      Logger.warn('FieldConfig is missing `readOnly`, `component` or `dataType` property.');
      field = (
        <Input
          key={fieldCfg?.dataField}
          placeholder=""
        />
      );
    }

    const formItemProps: FormItemProps = {
      rules: []
    };

    // when determining the status
    formItemProps.rules = [{
      required: fieldCfg.required
    }];

    if (fieldCfg.component === 'Switch') {
      formItemProps.valuePropName = 'checked';
    }

    const {
      dataField
    } = fieldCfg;

    return (
      <Form.Item
        key={dataField}
        name={dataField}
        className={`cls-${dataField}`}
        normalize={fieldCfg.component ? getNormalizeFn(dataField) : undefined}
        label={fieldCfg.labelI18n || `Field: ${fieldCfg.dataField}`}
        {...formItemProps}
        {...fieldCfg.formItemProps}
      >
        {field}
      </Form.Item>
    );
  };

  const parseFormConfig = (): React.ReactElement => {
    return <>
      {
        formConfig.fields?.map(createFormItem)
      }
    </>;
  };

  const initialValues = {};

  return (
    <Form
      className="general-entity-form"
      form={form}
      initialValues={initialValues}
      layout="vertical"
      name={formConfig?.name}
      {...formProps}
    >
      {
        parseFormConfig()
      }
    </Form>

  );
};

export default GeneralEntityForm;
