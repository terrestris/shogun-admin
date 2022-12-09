import React from 'react';

import { DatePicker, Form, Input, PageHeader, Select, Statistic, Switch } from 'antd';
const { TextArea } = Input;

import Logger from 'js-logger';

import _cloneDeep from 'lodash/cloneDeep';

import DisplayField from '../../FormField/DisplayField/DisplayField';
import { FormInstance, FormItemProps, FormProps } from 'antd/lib/form';
import YesOrNoField from '../../FormField/YesOrNoField/YesOrNoField';
import JSONEditor from '../../FormField/JSONEditor/JSONEditor';
import MarkdownEditor from '../../FormField/MarkdownEditor/MarkdownEditor';
import UserPermissionGrid from '../../FormField/UserPermissionGrid/UserPermissionGrid';
import LayerTypeSelect from '../../Layer/LayerTypeSelect/LayerTypeSelect';
import { InputNumber } from 'antd';
import TranslationUtil from '../../../Util/TranslationUtil';

import './GeneralEntityForm.less';

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
  label?: string;
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
  i18n: FormTranslations;
  entityName: string;
  entityType: string;
  formConfig: FormConfig;
  formProps?: Partial<FormProps>;
  form: FormInstance;
};

const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';

export type GeneralEntityFormProps = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export const GeneralEntityForm: React.FC<GeneralEntityFormProps> = ({
  i18n,
  entityName,
  entityType,
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
      case 'Number':
        return (
          <InputNumber
            {...fieldCfg?.fieldProps}
          />
        );
      case 'Switch':
        return (
          <Switch
            checkedChildren="On"
            unCheckedChildren="Off"
            {...fieldCfg?.fieldProps}
          />
        );
      case 'Select':
        return (
          <Select
            {...fieldCfg?.fieldProps}
          />
        );
      case 'LayerTypeSelect':
        return (
          <LayerTypeSelect
            {...fieldCfg?.fieldProps}
          />
        );
      case 'MarkdownEditor':
        return (
          <MarkdownEditor
            {...fieldCfg?.fieldProps}
          />
        );
      case 'Statistic':
        return (
          <Statistic {...fieldCfg?.fieldProps} />
        );
      case 'JSONEditor':
        return (
          <JSONEditor
            entityType={entityType}
            dataField={fieldCfg.dataField}
            {
              ...fieldCfg?.fieldProps
            }
          />
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
      case 'UserPermissionGrid':
        return (
          <UserPermissionGrid
            entityId={form.getFieldValue('id')}
            entityType={entityType.toLowerCase()}
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
    let copyFieldCfg = _cloneDeep(fieldCfg);
    copyFieldCfg.label = TranslationUtil.getTranslationFromConfig(fieldCfg.label as string, i18n);
    let field: React.ReactNode;
    if (copyFieldCfg.readOnly) {
      field = createReadOnlyComponent(copyFieldCfg);
    } else if (copyFieldCfg.component) {
      field = createFieldComponent(copyFieldCfg);
    } else if (copyFieldCfg.dataType) {
      field = getFieldByDataType(copyFieldCfg);
    } else {
      Logger.warn('FieldConfig is missing `readOnly`, `component` or `dataType` property.');
      field = (
        <Input
          key={copyFieldCfg?.dataField}
          placeholder=""
        />
      );
    }

    const formItemProps: FormItemProps = {
      rules: []
    };

    // when determining the status
    formItemProps.rules = [{
      required: copyFieldCfg.required
    }];

    if (copyFieldCfg.component === 'Switch') {
      formItemProps.valuePropName = 'checked';
    }

    const {
      dataField
    } = copyFieldCfg;

    return (
      <Form.Item
        key={`${entityType}-${form.getFieldValue('id')}-${dataField}`}
        name={dataField}
        className={`cls-${dataField}`}
        normalize={copyFieldCfg.component ? getNormalizeFn(dataField) : undefined}
        label={copyFieldCfg.label || `Field: ${copyFieldCfg.dataField}`}
        {...formItemProps}
        {...copyFieldCfg.formItemProps}
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

  const title = TranslationUtil.getTranslationFromConfig(entityName, i18n);

  return (
    <>
      <PageHeader title={title} />
      <Form
        className="general-entity-form"
        form={form}
        initialValues={initialValues}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        name={formConfig?.name}
        {...formProps}
      >
        {
          parseFormConfig()
        }
      </Form>
    </>
  );
};

export default GeneralEntityForm;
