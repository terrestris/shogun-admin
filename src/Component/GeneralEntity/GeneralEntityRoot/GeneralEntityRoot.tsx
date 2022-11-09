import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useNavigate,
  useLocation,
  matchPath,
  Link
} from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  Button,
  PageHeader,
  Form,
  notification,
  Upload,
  message
} from 'antd';
import {
  FormOutlined,
  SaveOutlined,
  UndoOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {
  RcFile,
  UploadChangeParam
} from 'antd/lib/upload';
import _isEmpty from 'lodash/isEmpty';

import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import TranslationUtil from '../../../Util/TranslationUtil';

import { getBearerTokenHeader } from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '@terrestris/shogun-util/dist/security/getCsrfTokenHeader';
import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import Logger from '@terrestris/base-util/dist/Logger';

import { NamePath } from 'rc-field-form/lib/interface';

import { ControllerUtil } from '../../../Controller/ControllerUtil';
import { GenericEntityController } from '../../../Controller/GenericEntityController';
import GeneralEntityForm, { FormConfig } from '../GeneralEntityForm/GeneralEntityForm';
import GeneralEntityTable, { TableConfig } from '../GeneralEntityTable/GeneralEntityTable';
import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';

import config from 'shogunApplicationConfig';
import './GeneralEntityRoot.less';

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

  const location = useLocation();
  const navigate = useNavigate();

  const match = matchPath({
    path: `${config.appPrefix}/portal/${entityType}/:entityId`
  }, location.pathname);
  const entityId = match?.params?.entityId;

  const [id, setId] = useState<number | 'create'>();
  const [editEntity, setEditEntity] = useState<T>();
  const [allEntities, setEntities] = useState<T[]>();
  const [formIsDirty, setFormIsDirty] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(true);
  const [isGridLoading, setGridLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);

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
    setGridLoading(true);
    const allEntries: T[] = await entityController?.findAll();
    setEntities(allEntries || []);
    setGridLoading(false);
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
      setEditEntity(undefined);
      setFormIsDirty(false);
      return;
    }
    if (entityId === 'create') {
      setEditEntity(undefined);
      setId(entityId);
      form.resetFields();
    } else {
      setId(parseInt(entityId, 10));
      setFormIsDirty(false);
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
    if (allEntities === undefined && !isGridLoading) {
      fetchEntities();
    }
  }, [fetchEntities, allEntities, isGridLoading]);

  /**
   * Table updates when Entities change
   */
  useEffect(() => {
    if (entityType) {
      fetchEntities();
    }
  }, [entityType]);

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
    setIsSaving(true);
    try {
      const updatedEntity: T = await entityController?.saveOrUpdate() as T;
      await fetchEntities();
      navigate(`${config.appPrefix}/portal/${entityType}/${updatedEntity.id}`);
      notification.success({
        message: t('GeneralEntityRoot.saveSuccess', {
          entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
        })
      });
    } catch (error) {
      Logger.error(`Error saving ${entityName}:`, error);
      notification.error({
        message: t('GeneralEntityRoot.saveFail', {
          entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
        })
      });
    } finally {
      setIsSaving(false);
      setFormIsDirty(false);
    }
  };

  const onBeforeFileUpload = (file: RcFile): Promise<void> => {
    // TODO: Complete quality check
    // 1. Check for file size. What should the limit be? Format dependent?
    // 2. Check if the selected file format is valid
    // 3. Check if the file is not broken/corrupted
    // 4. Other checks
    const maxSize = config.uploadLimits.geotiff;
    const fileType = file.type;
    const fileSize = file.size;

    return new Promise((resolve, reject) => {
      // 1. Check file size
      if (fileSize > maxSize) {
        message.error(t('GeneralEntityRoot.upload.error.size'), 5);
        reject();
      }
      // 2. Check file format
      if (fileType !== 'image/tiff') {
        message.error(t('GeneralEntityRoot.upload.error.type'), 5);
        reject();
      }
      resolve();
    });
  };

  const onFileUploadAction = async(options) => {
    const {onError, onSuccess} = options;

    const splittedFileName = options.file.name.split('.');
    const coverageStoreName = splittedFileName[splittedFileName.length - 2];
    const layerName = coverageStoreName;
    const workspace = 'SHOGUN';

    const url = '/geoserver/rest/workspaces/' + workspace + '/coveragestores/' +
    coverageStoreName + '/file.geotiff?coverageName=' + layerName;

    try {
      const request = await fetch(
        url,
        {
          method: 'PUT',
          headers: {
            ...getBearerTokenHeader(client?.getKeycloak()),
            'Content-Type': 'image/tiff',
          },
          body: options.file
        }
      );

      if (!request.ok) {
        onError();
        return;
      }
      const response = await request.text();

      onSuccess({
        name: layerName,
        type:'TILEWMS',
        clientConfig: {},
        sourceConfig:{
          url:'/geoserver/wms?',
          layerNames:`${workspace}:${layerName}`,
          useBearerToken:false
        },
        response
      });

    } catch (e) {
      onError(e.message, e);
    }
  };

  const onFileUploadChange = async(info: UploadChangeParam) => {
    const file = info.file;
    if (file.status === 'uploading') {
      setIsUploadingFile(true);
    }

    if (file.status === 'done') {
      // Add it to the layer list
      await fetch(
        '/layers',
        {
          method: 'POST',
          headers: {
            ...getBearerTokenHeader(client?.getKeycloak()),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(file.response)
        }
      );
      // refresh the list
      fetchEntities();
      // Finally, show success mesage
      setIsUploadingFile(false);
      message.success(t('GeneralEntityRoot.upload.success.message'), 5);
    } else if (file.status === 'error') {
      setIsUploadingFile(false);
      message.error(t('GeneralEntityRoot.upload.error.status'), 5);
    }
  };

  /**
   * Shortcut: Save entity form when ctrl+s is pressed.
   */
  const handleKeyboardSave = (event: KeyboardEvent) => {
    event.preventDefault();
    onSaveClick();
  };

  useHotkeys('ctrl+s', handleKeyboardSave, {
    enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'],
    filter: () => !saveReloadDisabled && formValid
  });

  const initialValues = useMemo(() => entityController?.getInitialFormValues(), [entityController]);
  const saveReloadDisabled = useMemo(() => _isEmpty(editEntity) || !formIsDirty, [formIsDirty, editEntity]);

  return (
    <div className="general-entity-root">
      <PageHeader
        className="header"
        onBack={() => navigate(-1)}
        title={TranslationUtil.getTranslationFromConfig(navigationTitle, i18n)}
        subTitle={subTitle}
        extra={[
          <Button
            disabled={saveReloadDisabled || !formValid}
            icon={<SaveOutlined />}
            key="save"
            onClick={onSaveClick}
            type="primary"
            loading={isSaving}
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
          {/* Upload only available for layer entities */}
          {entityType === 'layer' && (
            <Upload
              customRequest={onFileUploadAction}
              accept='image/tiff'
              headers={{
                ...getCsrfTokenHeader(),
                ...getBearerTokenHeader(client.getKeycloak())
              }}
              maxCount={1}
              showUploadList={false}
              beforeUpload={onBeforeFileUpload}
              onChange={onFileUploadChange}
            >
              <Button
                type="primary"
                key="upload"
                icon={<UploadOutlined />}
                loading={isUploadingFile}
                disabled={isUploadingFile}
              >
                {t('GeneralEntityRoot.upload.button', {
                  context: i18next.language,
                  entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
                })}
              </Button>
            </Upload>
          )}
        </div>
        <GeneralEntityTable
          i18n={i18n}
          bordered
          controller={entityController}
          entities={allEntities}
          entityType={entityType}
          fetchEntities={fetchEntities}
          loading={isGridLoading}
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
            entityType={entityType}
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
