import React, {
  useContext
} from 'react';

import { PageHeader } from '@ant-design/pro-components';

import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Statistic,
  Switch
} from 'antd';

import {
  FormInstance,
  FormItemProps,
  FormProps
} from 'antd/lib/form';

import Logger from 'js-logger';

import _cloneDeep from 'lodash/cloneDeep';

import TranslationUtil from '../../../Util/TranslationUtil';
import DisplayField from '../../FormField/DisplayField/DisplayField';
import JSONEditor from '../../FormField/JSONEditor/JSONEditor';
import MarkdownEditor from '../../FormField/MarkdownEditor/MarkdownEditor';
import GroupPermissionGrid from '../../FormField/Permission/GroupPermissionGrid/GroupPermissionGrid';
import { EntityType } from '../../FormField/Permission/InstancePermissionGrid/InstancePermissionGrid';
import RolePermissionGrid from '../../FormField/Permission/RolePermissionGrid/RolePermissionGrid';
import UserPermissionGrid from '../../FormField/Permission/UserPermissionGrid/UserPermissionGrid';
import YesOrNoField from '../../FormField/YesOrNoField/YesOrNoField';
import LayerTypeSelect from '../../Layer/LayerTypeSelect/LayerTypeSelect';
import GeneralEntityRootContext, {
  ContextValue
} from '../../../Context/GeneralEntityRootContext';

const { TextArea } = Input;

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
  publicKey?: string;
  fields: FieldConfig[];
};

interface OwnProps {
  loading?: boolean;
  i18n: FormTranslations;
  entityId?: number;
  formConfig: FormConfig;
  formProps?: Partial<FormProps>;
  form: FormInstance;
}

const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';

export type GeneralEntityFormProps = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export const GeneralEntityForm: React.FC<GeneralEntityFormProps> = ({
  loading = false,
  i18n,
  entityId,
  formProps,
  form,
  formConfig
}) => {

  const generalEntityRootContext = useContext<ContextValue<any> | undefined>(GeneralEntityRootContext);

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
   * @param fieldCfg
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
            entityType={generalEntityRootContext?.entityType || ''}
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
        if (entityId !== form.getFieldValue('id')) {
          return undefined;
        }

        return (
          <UserPermissionGrid
            entityId={form.getFieldValue('id')}
            entityType={generalEntityRootContext?.entityType?.toLowerCase() as EntityType}
            {...fieldCfg?.fieldProps}
          />
        );
      case 'GroupPermissionGrid':
        if (entityId !== form.getFieldValue('id')) {
          return undefined;
        }

        return (
          <GroupPermissionGrid
            entityId={form.getFieldValue('id')}
            entityType={generalEntityRootContext?.entityType?.toLowerCase() as EntityType}
            {...fieldCfg?.fieldProps}
          />
        );
      case 'RolePermissionGrid':
        if (entityId !== form.getFieldValue('id')) {
          return undefined;
        }

        return (
          <RolePermissionGrid
            entityId={form.getFieldValue('id')}
            entityType={generalEntityRootContext?.entityType?.toLowerCase() as EntityType}
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
  const getNormalizeFn = () => {
    let noValue: string = '';
    return (value: any, prevValue: any = []) => {
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
      component,
      dataField
    } = copyFieldCfg;

    return (
      <Form.Item
        key={`${generalEntityRootContext?.entityType}-${form.getFieldValue('id')}-${dataField || component?.toLocaleLowerCase()}`}
        name={dataField}
        className={`cls-${dataField}`}
        normalize={copyFieldCfg.component ? getNormalizeFn() : undefined}
        label={copyFieldCfg.label || `Field: ${copyFieldCfg.dataField}`}
        {...formItemProps}
        {...copyFieldCfg.formItemProps}
      >
        {field}
      </Form.Item>
    );
  };

  const initialValues = {};

  const title = TranslationUtil.getTranslationFromConfig(generalEntityRootContext?.entityName, i18n);

  return (
    <>
      <PageHeader
        title={title}
      />
      <Spin
        spinning={loading}
      >
        <Form
          className="general-entity-form"
          form={form}
          initialValues={initialValues}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
          name={formConfig?.name}
          {...formProps}
        >
          {formConfig.fields?.map(createFormItem)}
        </Form>
      </Spin>
    </>
  );
};

export default GeneralEntityForm;
