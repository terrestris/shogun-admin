import _debounce from 'lodash/debounce';
import _intersects from 'lodash/intersection';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';
import _isNumber from 'lodash/isNumber';
import _omit from 'lodash/omit';

import { ValidateStatus } from 'antd/lib/form/FormItem';

import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import GenericService from '@terrestris/shogun-util/dist/service/GenericService';
import Application from '@terrestris/shogun-util/dist/model/Application';

import Logger from '@terrestris/base-util/dist/Logger';

import { FieldConfig, FormConfig } from '../Component/GeneralEntity/GeneralEntityForm/GeneralEntityForm';

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
  protected service: GenericService<T>;
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

  /**
   * Load entity with given id using configured service and initialize the form values
   * @param id The id of the entitiy
   * @returns The entity
   */
  public async load(id: number): Promise<T> {
    this.entity = await this.service?.findOne(id);

    // initialize form value
    this.initializeFormValues();
    return this.entity;
  };

  /**
   * Create an empty instance and initialize form values
   * @returns The plain instance
   */
  public createEntity(): T {
    let entityCreated = this.create(BaseEntity);
    if (this.formConfig?.name === 'application') {
      entityCreated = this.create(Application);
    }
    this.entity = entityCreated as T;
    this.initializeFormValues();
    return this.entity;
  };

  public async delete(entity: T): Promise<void> {
    await this.service.delete(entity?.id);
  }

  /**
   * Fetch all entities
   */
  public async findAll(): Promise<T[]> {
    return await this.service?.findAll();
  }

  /**
   * Update the entitiy from the form
   *
   * @param values the form values containing only changed values
   */
  public async updateEntity(values: FormValues): Promise<void> {
    for (const fieldConfig of this.formConfig.fields) {
      if (values.hasOwnProperty(fieldConfig.dataField)) {
        await this.setEntityValue(fieldConfig, values[fieldConfig.dataField]);
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

  /**
   * Save / Update (partial) the actual entity omitting read only fields (e.g. id)
   * @returns The updated / saved entitiy
   */
  public async saveOrUpdate(): Promise<T> {
    const isUpdate = _isNumber(this?.entity?.id);

    // omit constant fields and read only fields
    let entityUpdateObject: Partial<T> = _omit(this?.entity, [
      'created',
      'modified',
      ...this.formConfig?.fields.filter(field => field.readOnly).map(field => field.dataField)
    ]);

    // re-add id for service methods
    if (isUpdate) {
      entityUpdateObject = {
        ...entityUpdateObject,
        id: this?.entity?.id
      };
    }

    this.entity = isUpdate ?
      await this.service?.update(entityUpdateObject as T) :
      await this.service.add(entityUpdateObject as T);

    return this.entity;
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
   * Update passed entity
   * @param e The entity of type T
   * @returns The updated entity
   */
  public async update(e: T): Promise<T> {
    return await this.service?.update(e);
  }

  /**
   * Save passed entity
   * @param e The entity of type T
   * @returns The saved entity
   */
  public async add(e: T): Promise<T> {
    return await this.service?.add(e);
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
   *
   * Currently not needed
   *
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
   * This function initiates a form change for all field configs that use one of the given dataFields.
   * It only adds the given dataFields to the value change object.
   * @param dataFields
   * @protected
   */
  protected addFormChangeForDataFields(dataFields: string[]) {
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
   * Adds form change entry for given field name
   * @param fieldName The field name
   * @param value The value
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

  /**
   * Set fields value of entity object given FieldConfig and FieldValue
   * @param fieldConfig The FieldConfig holding cofiguration
   * @param value The field value to set
   */
  private async setEntityValue(fieldConfig: FieldConfig, value: FieldValue): Promise<void>{
    this.setEntityValueByFieldConfig(fieldConfig, value);
    this.addFormChangeForDataFields([fieldConfig.dataField]);
  }

  /**
   * Return the value of the form field given its field configuration
   * @param fieldConfig The FieldConfig
   * @returns The FieldValue
   */
  private getFormValue(fieldConfig: FieldConfig): FieldValue {
    const value = this.getFormValueByFieldConfig(fieldConfig);
    if (!value) {
      return;
    }
    return value;
  }

  /**
   * Create new instance of class passed used in generics
   * @param clz The Class
   * @returns A corresponding instance
   */
  private create<Clz>(clz: new (args: any) => Clz): Clz {
    return new clz({});
  }

}
