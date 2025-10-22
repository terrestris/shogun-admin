import { ValidateStatus } from 'antd/lib/form/FormItem';
import _get from 'lodash/get';
import _intersects from 'lodash/intersection';
import _isNil from 'lodash/isNil';
import _isNumber from 'lodash/isNumber';
import _isString from 'lodash/isString';
import _omit from 'lodash/omit';
import _set from 'lodash/set';

import config from 'shogunApplicationConfig';

import Logger from '@terrestris/base-util/dist/Logger';
import Application from '@terrestris/shogun-util/dist/model/Application';
import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import { Page } from '@terrestris/shogun-util/dist/model/Page';
import { RevisionEntry } from '@terrestris/shogun-util/dist/model/Revision';
import { GenericEntityService } from '@terrestris/shogun-util/dist/service/GenericEntityService';
import { PageOpts } from '@terrestris/shogun-util/dist/service/GenericService';

import { FieldConfig, FormConfig } from '../Component/GeneralEntity/GeneralEntityForm/GeneralEntityForm';

// TODO: add explicit value objects
export type FieldValue = any;

export type FormValues = Record<string, FieldValue>;

export interface FieldValidation {
  validateStatus: ValidateStatus;
  message?: string;
  needsTranslation?: boolean;
}

export interface GenericEntityControllerArgs<T extends BaseEntity> {
  entity?: T;
  revisions?: RevisionEntry<T>[];
  formConfig: FormConfig;
  formValidator?: (values: FormValues) => void;
  initialValues?: FormValues;
  nextUpdate?: FormValues;
  service: GenericEntityService<T>;
}

export interface LoadEntityResponse<T> {
  entity: T;
  revisions?: RevisionEntry<T>[];
}

export class GenericEntityController<T extends BaseEntity> {
  protected entity: T | undefined;
  protected revisions: RevisionEntry<T>[] | undefined;
  protected initialValues?: FormValues;
  protected service: GenericEntityService<T>;
  private readonly formConfig: FormConfig;
  private formValidator?: (values: FormValues) => void;
  private nextUpdate?: FormValues;

  public constructor({
    entity,
    revisions,
    initialValues,
    service,
    formConfig,
    formValidator
  }: GenericEntityControllerArgs<T>) {
    this.formValidator = formValidator;
    this.service = service;
    this.formConfig = formConfig;
    if (!_isNil(entity)) {
      this.entity = entity;
    }
    if (!_isNil(revisions)) {
      this.revisions = revisions;
    }
    this.initialValues = initialValues;
  }

  public getEntity(): T | undefined {
    return this.entity;
  }

  public setFormValidator(formValidator: (values: FormValues) => void) {
    this.formValidator = formValidator;
  }

  /**
   * Load entity with given id using configured service and initialize the form values
   * @param id The id of the entitiy
   * @returns The entity
   */
  public async load(id: number): Promise<LoadEntityResponse<T>> {
    this.entity = await this.service?.findOne(id);

    if (config.entityHistory?.enabled) {
      this.revisions = await this.service?.findAllRevisions(id);
    }

    if (_isString(this.formConfig?.publicKey)) {
      const isPublic = await this.service.isPublic(this.entity.id!);
      const pubKey = this.formConfig.publicKey;
      (this.entity as Record<string, any>)[pubKey] = isPublic;
    }

    // initialize form value
    this.initializeFormValues();
    return {
      entity: this.entity,
      revisions: this.revisions
    };
  };

  /**
   * Load entity revision with given id using configured service and initialize the form values
   * @param id The id of the entitiy
   * @param revision The revision of the entitiy
   * @returns The entity
   */
  public async loadRevision(id: number, revision: number): Promise<T | undefined> {
    const entity = await this.service?.findRevision(id, revision);

    if (!entity) {
      return undefined;
    }

    this.entity = entity;

    if (_isString(this.formConfig?.publicKey)) {
      const isPublic = await this.service.isPublic(this.entity.id!);
      const pubKey = this.formConfig.publicKey;
      (this.entity as Record<string, any>)[pubKey] = isPublic;
    }

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
    if (!_isNil(entity?.id)) {
      await this.service.delete(entity?.id);
      return Promise.resolve();
    }
    return Promise.reject();
  }

  /**
   * Fetch all entities
   */
  public async findAll(pageOpts?: PageOpts): Promise<Page<T>> {
    return await this.service?.findAll(pageOpts);
  }

  /**
   * Update the entitiy from the form
   *
   * @param values the form values containing only changed values
   */
  public async updateEntity(values: FormValues, skipValidation = false): Promise<void> {
    for (const fieldConfig of this.formConfig.fields) {
      if (Object.prototype.hasOwnProperty.call(values, fieldConfig.dataField)) {
        await this.setEntityValue(fieldConfig, structuredClone(values[fieldConfig.dataField]));
      }
    }
    if (this.nextUpdate) {
      if (this.formValidator && !skipValidation) {
        this.formValidator(this.nextUpdate);
      } else {
        Logger.warn('No formValidator set for EntityController or requested to skip validation');
      }
      this.nextUpdate = undefined;
    }
  }

  /**
   * Save / Update (partial) the actual entity omitting read only fields (e.g. id)
   * @returns The updated / saved entitiy
   */
  public async saveOrUpdate(): Promise<T> {
    const isUpdate = _isNumber(this.entity?.id);

    const publicKey = this.formConfig.publicKey as keyof T;
    const isPublic = publicKey ? this.entity?.[publicKey] : undefined;

    // omit constant fields and read only fields
    let entityUpdateObject: Partial<T> = _omit(this.entity, [
      'created',
      'modified',
      ...this.formConfig.fields
        .filter(field => field.dataField === publicKey || field.readOnly)
        .map(field => field.dataField)
    ]);

    // re-add id for service methods
    if (isUpdate) {
      entityUpdateObject = {
        ...entityUpdateObject,
        id: this.entity?.id
      };
    }

    this.entity = isUpdate ?
      await this.service.update(entityUpdateObject as T) :
      await this.service.add(entityUpdateObject as T);

    if (publicKey) {
      if (isPublic) {
        await this.service.setPublic(this.entity.id!);
      } else {
        await this.service.revokePublic(this.entity.id!);
      }
    }

    return this.entity;
  }

  public getFormConfig(): FormConfig {
    return this.formConfig;
  }

  /**
   * Return the initial form values
   */
  public getInitialFormValues(): FormValues | undefined {
    return this.initialValues;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isFieldValid(_fieldConfig: FieldConfig, _value: FieldValue): FieldValidation {
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
          this.addFormChange(fieldConfig.dataField, _get(this.entity, fieldConfig.dataField));
        }
      } else {
        if (_intersects(fieldConfig.dataField, dataFields)) {
          const values = {};
          for (const dataField of fieldConfig.dataField) {
            if (dataFields.includes(dataField)) {
              _set(values, dataField, _get(this.entity, dataField));
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
      if (!_isNil(fieldConfig.component) && components.includes(fieldConfig.component)) {
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
    if (_isNil(this.entity)) {
      return;
    }
    if (!Array.isArray(fieldConfig.dataField)) {
      _set(this.entity, fieldConfig.dataField, value);
    } else {
      for (const dataField of fieldConfig.dataField) {
        _set(this.entity, dataField, _get(value, dataField));
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
      return _get(this.entity, fieldConfig.dataField);
    } else {
      const result = {};
      for (const dataField of fieldConfig.dataField) {
        _set(result, dataField, _get(this.entity, dataField));
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
          this.addFormChange(fieldConfig.dataField, _get(this.entity, fieldConfig.dataField));
        }
      } else {
        if (_intersects(fieldConfig.dataField, dataFields)) {
          const values = {};
          for (const dataField of fieldConfig.dataField) {
            if (dataFields.includes(dataField)) {
              _set(values, dataField, _get(this.entity, dataField));
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
