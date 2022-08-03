import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useHistory,
  useLocation,
  matchPath,
  Link
} from 'react-router-dom';
import { Button, PageHeader, Form, notification } from 'antd';
import _isEmpty from 'lodash/isEmpty';

import { ControllerUtil } from '../../../Controller/ControllerUtil';
import { FormOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { GenericEntityController } from '../../../Controller/GenericEntityController';
import Logger from '@terrestris/base-util/dist/Logger';
import { NamePath } from 'rc-field-form/lib/interface';
import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import config from 'shogunApplicationConfig';
import GeneralEntityForm, { FormConfig } from '../GeneralEntityForm/GeneralEntityForm';
import GeneralEntityTable, { TableConfig } from '../GeneralEntityTable/GeneralEntityTable';
import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';

import { useTranslation } from 'react-i18next';

import './GeneralEntityRoot.less';
import i18next from 'i18next';
import TranslationUtil from '../../../Util/TranslationUtil';

export type GeneralEntityConfigType<T extends BaseEntity> = {
  i18n: FormTranslations;
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

export function GeneralEntityRoot<T extends BaseEntity>({
  i18n,
  endpoint,
  entityType,
  entityName = 'Entität',
  navigationTitle = 'Entitäten',
  subTitle = '… mit denen man Dinge tun kann (aus Gründen bspw.)',
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

  const client = useSHOGunAPIClient();

  const {
    t
  } = useTranslation();

  /**
   * Validate form fields
   */
  const validate = useCallback(async (nameList?: NamePath[]) => {
    let valid: boolean;
    try {
      // TODO: check validation of JSON (and MarkDownEditor) if used for field
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
  }, [formConfig?.fields, validate]);

  const entityController: GenericEntityController<T> = useMemo(() => ControllerUtil.createController({
    endpoint,
    keycloak: client.getKeycloak(),
    entityType,
    formConfig,
    updateForm
  }), [endpoint, client, entityType, formConfig, updateForm]) as GenericEntityController<T>;

  /**
   * Fetch entity with given id
   */
  const fetchEntity = useCallback(async (eId: number) => {
    try {
      const e: T = await entityController?.load(eId) as T;
      setEditEntity(e);
      form.resetFields();
      form.setFieldsValue(e);
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
  }, [id, fetchEntity, editEntity, entityController, form]);

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
      form.resetFields();
    } else {
      setId(parseInt(entityId, 10));
    }
  }, [entityId, form]);

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
    entityController.createEntity();
  };

  const onSaveClick = async () => {
    try {
      const updatedEntity: T = await entityController?.saveOrUpdate() as T;
      await fetchEntities();
      history.push(`${config.appPrefix}/portal/${entityType}/${updatedEntity.id}`);
      notification.success({
        message: `${entityName} erfolgreich gespeichert!`
      });
    } catch (error) {
      Logger.error(`Error saving ${entityName}:`, error);
      notification.error({
        message: `Fehler: Konnte ${entityName} nicht speichern.`
      });
    }
  };

  const initialValues = useMemo(() => entityController?.getInitialFormValues(), [entityController]);
  const saveReloadDisabled = useMemo(() => _isEmpty(editEntity) || !formIsDirty, [formIsDirty, editEntity]);

  return (
    <div className="general-entity-root">
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title={TranslationUtil.getTranslationFromConfig(navigationTitle, i18n)}
        subTitle={subTitle}
        extra={[
          <Button
            disabled={saveReloadDisabled || !formValid}
            icon={<SaveOutlined />}
            key="save"
            onClick={onSaveClick}
            type="primary"
          >
            {t('GeneralEntityRoot.save', {
              context: i18next.language,
              entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
            })}
          </Button>,
          <Button
            disabled={saveReloadDisabled}
            icon={<UndoOutlined />}
            key="reset"
            onClick={onResetForm}
            type="primary"
          >
            {t('GeneralEntityRoot.reset', {
              context: i18next.language,
              entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
            })}
          </Button>
        ]}
      >
      </PageHeader>
      <div className="left-container">
        <div className="left-toolbar">
          <Link
            key="create"
            to={`${config.appPrefix}/portal/${entityType}/create`}
            onClick={onResetForm}
          >
            <Button
              type="primary"
              key="create"
              icon={<FormOutlined />}
            >
              {t('GeneralEntityRoot.create', {
                context: i18next.language,
                entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
              })}
            </Button>
          </Link>
        </div>
        <GeneralEntityTable
          i18n={i18n}
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
            i18n={i18n}
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
