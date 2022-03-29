import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useHistory,
  useLocation,
  matchPath,
  Link
} from 'react-router-dom';
import { Button, PageHeader, Form } from 'antd';
import _isEmpty from  'lodash/isEmpty';

import { ControllerUtil } from '../../../Controller/ControllerUtil';
import { FormOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { GenericEntityController } from '../../../Controller/GenericEntityController';
import { Logger } from '@terrestris/base-util';
import { NamePath } from 'rc-field-form/lib/interface';
import BaseEntity from '../../../Model/BaseEntity';
import config from 'shogunApplicationConfig';
import GeneralEntityForm, { FormConfig } from '../GeneralEntityForm/GeneralEntityForm';
import GeneralEntityTable, { TableConfig } from '../GeneralEntityTable/GeneralEntityTable';

import './GeneralEntityRoot.less';

export type GeneralEntityConfigType<T extends BaseEntity> = {
  endpoint: string;
  entityType: string;
  entityName?: string;
  navigationTitle?: string;
  subTitle?: string;
  formConfig: FormConfig;
  tableConfig: TableConfig<T>;
};

type OwnProps<T extends BaseEntity> = GeneralEntityConfigType<T>;

export type GeneralEntityRootProps<T extends BaseEntity> = OwnProps<T> & React.HTMLAttributes<HTMLDivElement>;

export function GeneralEntityRoot<T extends BaseEntity> ({
  endpoint,
  entityType,
  entityName = 'Entität',
  navigationTitle = 'Entitäten',
  subTitle = '… mit denen man Dingen tun kann (aus Gründen bspw.)',
  formConfig,
  tableConfig = {}
}: GeneralEntityRootProps<T>) {

  const history = useHistory();
  const location = useLocation();
  const match = matchPath<{ entityId: string }>(location.pathname, {
    path: `${config.appPrefix}/portal/${entityType}/:entityId`
  });
  const entityId = match?.params?.entityId;

  const [id, setId] = useState<number | 'create'>();
  const [editEntity, setEditEntity] = useState<T>();
  const [allEntities, setEntities] = useState<T[]>();
  const [formIsDirty, setFormIsDirty] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  /**
   * Validate form fields
   */
  const validate = useCallback(async (nameList?: NamePath[]) => {
    let valid: boolean;
    try {
      await form.validateFields(nameList || []);
      valid = true;
    } catch (e) {
      if ('errorFields' in e) {
        valid = false;
      } else {
        throw e;
      }
    }
    setFormValid(valid);
  }, [form]);

  const updateForm = useCallback(async (): Promise<void> => {
    const nameList = formConfig?.fields.filter(field => field.required).map(field => field.dataField);
    validate(nameList);
  }, [form, validate]);

  const entityController: GenericEntityController<T> = useMemo(() => ControllerUtil.createController({
    endpoint,
    entityType,
    formConfig,
    updateForm
  }), [endpoint, entityType]) as GenericEntityController<T>;

  /**
   * Fetch entity with given id
   */
  const fetchEntity = useCallback(async (eId: number) => {
    try {
      const e: T = await entityController?.load(eId) as T;
      setEditEntity(e);
      form.resetFields();
    } catch (error) {
      Logger.error(error);
    }
  }, [form, entityController]);

  /**
   * Fetch all entities shown in table
   */
  const fetchEntities = useCallback(async () => {
    setLoading(true);
    const allEntries: T[] = await entityController?.findAll();
    setEntities(allEntries || []);
    setLoading(false);
  }, [entityController]);

  /**
   * Fetch entity or create new one
   */
  useEffect(() => {
    if (id && id.toString() !== 'create' && id !== editEntity?.id) {
      fetchEntity(parseInt(id.toString(), 10));
    }
    if (id && id.toString() === 'create' && editEntity === undefined) {
      const e: T = entityController?.createEntity();
      setEditEntity(e);
      form.setFieldsValue(entityController?.getEntity());
    }
  }, [id, fetchEntity, editEntity]);

  /**
   * Set actual edited entity
   */
  useEffect(() => {
    if (!entityId) {
      setId(undefined);
      return;
    }
    if (entityId === 'create') {
      setEditEntity(undefined);
      setId(entityId);
    } else {
      setId(parseInt(entityId, 10));
    }
  }, [entityId]);

  // Once the controller is known we need to set the formUpdater so we can update
  // a given form when the entity is updated via controller
  useEffect(() => {
    if (entityController) {
      entityController.setFormUpdater(updateForm);
    }
  }, [updateForm, entityController]);

  /**
   * Init data
   */
  useEffect(() => {
    if (allEntities === undefined && !isLoading) {
      fetchEntities();
    }
  }, [fetchEntities, allEntities, isLoading]);

  const onValuesChange = async (changedValues: any) => {
    setFormIsDirty(true);
    await entityController.updateEntity(changedValues);
  };

  const onResetForm = () => {
    form?.resetFields();
    setFormIsDirty(false);
  }

  const onSaveClick = async () => {
    const updatedEntity: T = await entityController?.saveOrUpdate() as T;
    setEditEntity(updatedEntity);
    setFormIsDirty(false);
    await fetchEntities();
  }

  const initialValues = useMemo(() => entityController?.getInitialFormValues(), [entityController?.getEntity()]);
  const saveReloadDisabled = useMemo(() => _isEmpty(editEntity) || !formIsDirty, [formIsDirty, editEntity]);

  return (
    <div className="general-entity-root">
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title={navigationTitle}
        subTitle={subTitle}
        extra={[
          <Link key="create" to={`${config.appPrefix}/portal/${entityType}/create`}>
            <Button
              type="primary"
              key="create"
              icon={<FormOutlined />}
              onClick={onSaveClick}
            >
              {`${entityName} anlegen`}
            </Button>
          </Link>,
          <Button
            disabled={saveReloadDisabled || !formValid}
            icon={<SaveOutlined />}
            key="save"
            onClick={onSaveClick}
            type="primary"
          >
            {`${entityName} speichern`}
          </Button>,
          <Button
            disabled={saveReloadDisabled}
            icon={<UndoOutlined />}
            key="reset"
            onClick={onResetForm}
            type="primary"
          >
            {`${entityName} zurücksetzen`}
          </Button>
        ]}
      >
      </PageHeader>
      <div className="left-container">
        <GeneralEntityTable
          bordered
          controller={entityController}
          entities={allEntities}
          entityType={entityType}
          fetchEntities={fetchEntities}
          loading={isLoading}
          size="small"
          tableConfig={tableConfig}
        />
      </div>
      {
        id &&
        <div className="right-container">
          <GeneralEntityForm
            entityName={entityName}
            formConfig={formConfig}
            form={form}
            formProps={{
              initialValues,
              onValuesChange
            }}
          />
        </div>
      }
    </div>
  );
};

export default GeneralEntityRoot;
