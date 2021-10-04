import _isNil from 'lodash/isNil';
import _debounce from 'lodash/debounce';
import _intersects from 'lodash/intersection';

import BaseEntity from '../Model/BaseEntity';
import { ValidateStatus } from 'antd/lib/form/FormItem';
import GenericService from '../Service/GenericService/GenericService';
import { FieldConfig, FormConfig } from '../Component/GeneralEntity/GeneralEntityForm/GeneralEntityForm';
import { Logger } from '@terrestris/base-util';

// TODO: add explicit value objects
export type FieldValue = any;

export type FormValues = {
  [key: string]: FieldValue;
};

export type FieldValidation = {
  validateStatus: ValidateStatus;
  message?: string;
  needsTranslation?: boolean;
};

export type GenericEntityControllerArgs<T extends BaseEntity> = {
  service: GenericService<T>;
  formUpdater?: (values: FormValues) => void; // maybe not required
  formConfig: FormConfig;
};

export class GenericEntityController<T extends BaseEntity> {
  protected entity: T;
  protected initialValues: FormValues;
  protected service:  GenericService<T>;
  private formConfig: FormConfig;
  private formUpdater?: (values: FormValues) => void; // maybe not required
  private nextUpdate: FormValues;

  public constructor({
    service,
    formConfig,
    formUpdater
  }: GenericEntityControllerArgs<T>) {
    this.formUpdater = formUpdater;
    this.service = service;
    this.formConfig = formConfig;
  }

  public getEntity(): T {
    return this.entity;
  }

  public setFormUpdater(formUpdater: (values: FormValues) => void) {
    this.formUpdater = formUpdater;
  }

  public async load(id: number): Promise<T> {
    this.entity = await this.service?.findOne(id);

    // initialize form value
    this.initializeFormValues();

    return this.entity;
  };

  public create(): T {
    // this.entity = { };
    this.initializeFormValues();
    return this.entity;
  }

  public delete(entites: T[]): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Update the entitiy from the form
   *
   * @param values the form values containing only changed values
   */
  public async updateEntity(values: FormValues): Promise<void> {
    for (const fieldConfig of this.formConfig.fields) {
      if (fieldConfig.hasOwnProperty(fieldConfig.dataField)) {
        await this.setEntityValue(fieldConfig, fieldConfig.dataField);
      }
    }
    if (this.nextUpdate) {
      if (this.formUpdater) {
        this.formUpdater(this.nextUpdate);
      } else {
        Logger.warn('No formUpdater set for EntityController');
      }
      this.nextUpdate = null;
    }
  }

  public getFormConfig(): FormConfig {
    return this.formConfig;
  }

  /**
   * Return the initial form values
   */
  public getInitialFormValues(): FormValues {
    return this.initialValues;
  }

  public isFieldValid(fieldConfig: FieldConfig, value: FieldValue): FieldValidation {
    return {
      validateStatus: 'success'
    };
  }

  /**
   * This function initiates a form change for all field configs that use one of the given dataFields.
   * It only adds the given dataFields to the value change object.
   * @param dataFields
   * @protected
   */
  protected updateFormForDataFields(dataFields: string[]) {
    for (const fieldConfig of this.formConfig.fields) {
      if (!Array.isArray(fieldConfig.dataField)) {
        if (dataFields.includes(fieldConfig.dataField)) {
          this.addFormChange(fieldConfig.dataField, this.entity[fieldConfig.dataField]);
        }
      } else {
        if (_intersects(fieldConfig.dataField, dataFields)) {
          const values = {};
          for (const dataField of fieldConfig.dataField) {
            if (dataFields.includes(dataField)) {
              values[dataField] = this.entity[dataField];
            }
          }
          this.addFormChange(fieldConfig.dataField, values);
        }
      }
    }
  }

  /**
   * Update the form only for specific components
   * @param components that are affected by the change
   * @param values that should be given to the form
   * @protected
   */
  protected updateFormForComponents(components: string[], values: FieldValue) {
    for (const fieldConfig of this.formConfig.fields) {
      if (components.includes(fieldConfig.component)) {
        this.addFormChange(fieldConfig.dataField, values);
      }
    }
  }

  /**
   * this sets the entity values that are specified by the data fields in the field config to the values
   * given by value.
   * @param fieldConfig
   * @param value
   * @protected
   */
  protected setEntityValueByFieldConfig(fieldConfig: FieldConfig, value: FieldValue) {
    if (!Array.isArray(fieldConfig.dataField)) {
      this.entity[fieldConfig.dataField] = value;
    } else {
      for (const dataField of fieldConfig.dataField) {
        this.entity[dataField] = value[dataField];
      }
    }
  }

  /**
   * create the form values object that is defined by the data fields in the field config from the entity.
   * @param fieldConfig
   * @protected
   */
  protected getFormValueByFieldConfig(fieldConfig: FieldConfig): FieldValue {
    if (!Array.isArray(fieldConfig.dataField)) {
      return this.entity[fieldConfig.dataField];
    } else {
      const result = {};
      for (const dataField of fieldConfig.dataField) {
        result[dataField] = this.entity[dataField];
      }
      return result;
    }
  }

  /**
   * create form values object to initialize the form
   */
  protected initializeFormValues(): void {
    const values: FormValues = {};
    for (const fieldConfig of this.formConfig.fields) {
      values[fieldConfig.dataField] = this.getFormValue(fieldConfig);
    }
    this.initialValues = values;
  }

  /**
   * This gets the value of a given datafield if it is in the fieldconfig
   * @param fieldConfig
   * @param value
   * @param dataField
   * @protected
   */
  protected getDataFieldValue(fieldConfig: FieldConfig, value: FieldValue, dataField: string) {
    if (Array.isArray(fieldConfig.dataField) && fieldConfig.dataField.includes(dataField)) {
      return value[dataField];
    } else if (fieldConfig.dataField === dataField) {
      return value;
    }
  }

  /**
   * returns true if the current config contains the datafield
   * @param fieldConfig
   * @param dataField
   * @protected
   */
  protected hasDataFieldValue(fieldConfig: FieldConfig, dataField: string) {
    return (Array.isArray(fieldConfig.dataField) && fieldConfig.dataField.includes(dataField))
      || fieldConfig.dataField === dataField;
  }

  /**
   * This updates the given value and returns the new value. in case value is an object it is changed.
   * @param fieldConfig
   * @param value
   * @param dataField
   * @param newValue
   * @protected
   */
  protected updateDataFieldValue(fieldConfig: FieldConfig, value: FieldValue, dataField: string,
    newValue: any): FieldValue {
    if (Array.isArray(fieldConfig.dataField) && fieldConfig.dataField.includes(dataField)) {
      return Object.assign(value, { [dataField]: newValue });
    } else {
      return newValue;
    }
  }

  /**
   *
   * @param panelName
   * @param fieldName
   * @param value
   */
  private addFormChange(fieldName: string, value: FieldValue) {
    if (!this.nextUpdate) {
      this.nextUpdate = {};
    }
    if (!this.nextUpdate[fieldName]) {
      this.nextUpdate[fieldName] = {};
    }
    if (!this.nextUpdate[fieldName]) {
      this.nextUpdate[fieldName] = value;
    } else {
      Object.assign(this.nextUpdate[fieldName], value);
    }
  }

  private async setEntityValue(fieldConfig: FieldConfig, value: FieldValue): Promise<void>{
    this.setEntityValueByFieldConfig(fieldConfig, value);
  }

  private getFormValue(fieldConfig: FieldConfig): FieldValue {
    const value = this.getFormValueByFieldConfig(fieldConfig);
    if (!value) {
      return;
    }
    return value;
  }
}
