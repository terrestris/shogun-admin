import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  FormOutlined,
  SaveOutlined,
  UndoOutlined
} from '@ant-design/icons';

import { PageHeader } from '@ant-design/pro-layout';
import {
  Button,
  Form,
  notification,
  Modal
} from 'antd';
import {
  TableProps,
} from 'antd/es/table';
import {
  SortOrder
} from 'antd/es/table/interface';

import i18next from 'i18next';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';
import {
  NamePath
} from 'rc-field-form/lib/interface';

import {
  useHotkeys
} from 'react-hotkeys-hook';
import {
  useTranslation
} from 'react-i18next';
import {
  Link,
  matchPath,
  useLocation,
  useNavigate
} from 'react-router-dom';

import { useSetRecoilState } from 'recoil';
import config from 'shogunApplicationConfig';

import Logger from '@terrestris/base-util/dist/Logger';
import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';

import { PageOpts } from '@terrestris/shogun-util/dist/service/GenericService';

import { GeneralEntityRootProvider } from '../../../Context/GeneralEntityRootContext';
import {
  ControllerUtil
} from '../../../Controller/ControllerUtil';
import {
  FormValues,
  GenericEntityController
} from '../../../Controller/GenericEntityController';
import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import { entityIdAtom } from '../../../State/atoms';
import TranslationUtil from '../../../Util/TranslationUtil';
import GeneralEntityForm, {
  FormConfig
} from '../GeneralEntityForm/GeneralEntityForm';
import GeneralEntityTable, {
  TableConfig
} from '../GeneralEntityTable/GeneralEntityTable';

import './GeneralEntityRoot.less';

export interface GeneralEntityConfigType<T extends BaseEntity> {
  i18n: FormTranslations;
  endpoint: string;
  entityType: string;
  defaultSortField?: string;
  entityName?: string;
  navigationTitle?: string;
  subTitle?: string;
  formConfig: FormConfig;
  tableConfig: TableConfig<T>;
  onEntitiesLoaded?: (entities: T[], entityType: string) => void;
  defaultEntity?: T;
}

export type ToolbarSlotProps = {
  onSuccess?: () => void;
  onError?: () => void;
} & Record<string, any>;

type OwnProps<T extends BaseEntity> = GeneralEntityConfigType<T> & {
  /**
   * Slots for additional components that are dependent on the entity type.
   */
  slots?: {
    /**
     * Slot for left toolbar (above the table).
     */
    leftToolbar?: React.ReactNode;
  };
};

export type GeneralEntityRootProps<T extends BaseEntity> = OwnProps<T> & React.HTMLAttributes<HTMLDivElement>;

export function GeneralEntityRoot<T extends BaseEntity>({
  i18n,
  endpoint,
  entityType,
  defaultSortField,
  entityName = 'Entität',
  navigationTitle = 'Entitäten',
  subTitle = '… mit denen man Dinge tun kann (aus Gründen bspw.)',
  formConfig,
  tableConfig,
  defaultEntity,
  onEntitiesLoaded,
  slots
}: GeneralEntityRootProps<T>) {

  const location = useLocation();
  const navigate = useNavigate();
  const setEntityId = useSetRecoilState(entityIdAtom);

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
  const [isFormLoading, setFormLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [pageTotal, setPageTotal] = useState<number>();
  const [pageSize, setPageSize] = useState<number>(config.defaultPageSize || 10);
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  const [sortField, setSortField] = useState<string | undefined>(defaultSortField);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>('ascend');
  const [isFiltered, setFiltered] = useState<boolean>(false);
  const [isPreviousFormDirty, setIsPreviousFormDirty] = useState<boolean>(false);

  const [modal, contextHolder] = Modal.useModal();

  const [form] = Form.useForm<FormValues | undefined>();

  const client = useSHOGunAPIClient();

  const {
    t
  } = useTranslation();

  useEffect(() => {
    setSortField(defaultSortField ? defaultSortField : undefined);
    setSortOrder('ascend');
    setPageCurrent(1);
    setFiltered(false); // to always obtain pagination when changing the entity
  }, [entityType, defaultSortField]);

  /**
   * Validate form fields
   */
  const validate = useCallback(async (nameList?: NamePath[]) => {
    let valid: boolean;
    try {
      // TODO: check validation of JSON (and MarkDownEditor) if used for field
      await form.validateFields(nameList || []);
      valid = true;
    } catch (e: any) {
      if ('errorFields' in e) {
        valid = false;
      } else {
        throw e;
      }
    }
    setFormValid(valid);
  }, [form]);

  const formValidator = useCallback(async (): Promise<void> => {
    const nameList = formConfig?.fields.filter(field => field.required).map(field => field.dataField);
    validate(nameList);
  }, [formConfig?.fields, validate]);

  const entityController: GenericEntityController<T> = useMemo(() => ControllerUtil.createController({
    endpoint,
    keycloak: client?.getKeycloak(),
    entityType,
    formConfig,
    formValidator
  }), [endpoint, client, entityType, formConfig, formValidator]) as GenericEntityController<T>;

  /**
   * Fetch entity with given id
   */
  const fetchEntity = useCallback(async (eId: number) => {
    try {
      setFormLoading(true);
      const e: T = await entityController?.load(eId) as T;
      setEditEntity(e);
      form.resetFields();
      form.setFieldsValue(e);
    } catch (error) {
      Logger.error(error);
    } finally {
      setFormLoading(false);
    }
  }, [form, entityController]);

  /**
   * Fetch all entities shown in table
   */
  const fetchEntities = useCallback(async () => {
    if (!entityType) {
      return;
    }

    try {
      setGridLoading(true);

      const pageOpts: PageOpts | undefined = isFiltered ? undefined : {
        page: pageCurrent - 1,
        size: pageSize,
        sort: {
          properties: _isNil(sortField) ? [] : [sortField],
          order: sortOrder === 'ascend' ? 'asc' : sortOrder === 'descend' ? 'desc' : undefined
        }
      };

      const allEntries = await entityController?.findAll(pageOpts);

      setPageTotal(allEntries.totalElements);
      setEntities(allEntries.content || []);
      onEntitiesLoaded?.(allEntries.content, entityType);
    } catch (error) {
      Logger.error(error);
    } finally {
      setGridLoading(false);
    }
  }, [entityController, onEntitiesLoaded, entityType, pageCurrent, pageSize, sortField, sortOrder, isFiltered]);

  const contextValue = useMemo(() => ({
    entityType: entityType,
    entityName: entityName,
    fetchEntities: fetchEntities,
    entities: allEntities
  }), [entityType, entityName, fetchEntities, allEntities]);

  const discardChanges = () => {
    Modal.destroyAll();
    if (!_isNil(id)){
      fetchEntity(parseInt(id.toString(), 10));
    }
    notification.info({
      message: t('GeneralEntityRoot.saveWarning', {
        entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
      })
    });
  };

  const saveChanges = () => {
    onSaveClick();
    if (!_isNil(id)) {
      fetchEntity(parseInt(id.toString(), 10));
    }
    Modal.destroyAll();
  };

  /**
   * Fetch entity or create new one
   * A modal is called in case edited entity is not saved
   */
  useEffect(() => {
    if (id && id.toString() !== 'create' && id !== editEntity?.id) {
      if (isPreviousFormDirty) {
        modal.confirm({
          title: t('GeneralEntityRoot.reminderModal.title'),
          content: t('GeneralEntityRoot.reminderModal.description'),
          okText: t('GeneralEntityRoot.reminderModal.accept'),
          cancelText: t('GeneralEntityRoot.reminderModal.decline'),
          closable: true,
          footer: ([
            <div key="modalButtons" className='selectionButtons'>
              <Button className='discardChangesButton'
                onClick={() => discardChanges()}
              >{t('GeneralEntityRoot.reminderModal.decline')}
              </Button>
              <Button type="primary" className='acceptChangesButton'
                onClick={() => saveChanges()}
              >{t('GeneralEntityRoot.reminderModal.accept')}
              </Button>
            </div>
          ]),
        });
      }
      else {
        fetchEntity(parseInt(id.toString(), 10));
      }
      // here we either saved or discarded the changes, so we don't need the value anymore
      setIsPreviousFormDirty(false);
    }
    if (id && id.toString() === 'create' && editEntity === undefined) {
      const e: T = entityController?.createEntity();
      setEditEntity(e);
      form.setFieldsValue(entityController?.getEntity());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, fetchEntity, editEntity, entityController, form, modal]);

  useEffect(() => {
    if (formIsDirty) {
      // only set if it changes from false to true, but not when it changes back
      setIsPreviousFormDirty(true);
    }
  }, [formIsDirty]);

  /**
   * Set actual edited entity
   */
  useEffect(() => {
    if (!entityId) {
      setId(undefined);
      setEntityId(undefined);
      setEditEntity(undefined);
      setFormIsDirty(false);
      return;
    }
    if (entityId === 'create') {
      setId(entityId);
      setEntityId(undefined);
      form.resetFields();
      form.setFieldsValue(structuredClone(defaultEntity));
      entityController.updateEntity(defaultEntity as FormValues, true);
    } else {
      setId(parseInt(entityId, 10));
      setEntityId(parseInt(entityId, 10));
      setFormIsDirty(false);
    }
  }, [entityId, form, defaultEntity, setEntityId, entityController]);

  // Once the controller is known we need to set the formValidator so we can update
  // a given form when the entity is updated via controller
  useEffect(() => {
    if (entityController) {
      entityController.setFormValidator(formValidator);
    }
  }, [formValidator, entityController]);

  /**
   * Init data (and update if the dependencies of fetchEntities change)
   */
  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  const onValuesChange = async (changedValues: FormValues) => {
    setFormIsDirty(true);

    await entityController.updateEntity(changedValues);
  };

  const onResetForm = () => {
    const oldValues = allEntities?.find((entity) => entity.id === id);
    if (!oldValues) {
      return;
    }

    form.resetFields();
    form.setFieldsValue(oldValues);
    setFormIsDirty(false);
  };

  const onCreateForm = () => {
    setEditEntity(undefined);
    setId('create');
  };

  const onSaveClick = async () => {
    setIsSaving(true);
    try {
      const updatedEntity: T = await entityController?.saveOrUpdate() as T;
      await fetchEntities();
      await fetchEntity(updatedEntity.id!);
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
      setIsPreviousFormDirty(false);
      setFormIsDirty(false);
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
    enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
    enabled: () => !saveReloadDisabled && formValid
  });

  const initialValues = useMemo(() => entityController?.getInitialFormValues(), [entityController]);
  const saveReloadDisabled = useMemo(() => _isEmpty(editEntity) || !formIsDirty, [formIsDirty, editEntity]);

  const onTableChange: TableProps<T>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    if (!Array.isArray(sorter)) {
      setSortOrder(sorter.order);
      setSortField(sorter.field as string);
    }

    const anyColumnIsFiltered = Object.keys(filters)
      .some(attribute => !_isNil(filters[attribute]) || !_isEmpty(filters[attribute]));
    setFiltered(anyColumnIsFiltered);
    setPageCurrent(pagination.current!);
    setPageSize(pagination.pageSize!);
  };

  const paginationConfig = {
    total: pageTotal,
    current: pageCurrent,
    pageSize: pageSize,
    showTotal: (total: number) => `${t('GeneralEntityTable.paging.total')}: ${total}`,
    showSizeChanger: true,
    showQuickJumper: true,
    locale: {
      // eslint-disable-next-line camelcase
      next_page: t('GeneralEntityTable.paging.nextPage'),
      // eslint-disable-next-line camelcase
      prev_page: t('GeneralEntityTable.paging.prevPage'),
      // eslint-disable-next-line camelcase
      items_per_page: `/ ${t('GeneralEntityTable.paging.itemsPerPage')}`,
      // eslint-disable-next-line camelcase
      jump_to: t('GeneralEntityTable.paging.jumpTo'),
      page: t('GeneralEntityTable.paging.page')
    }
  };

  return (
    <GeneralEntityRootProvider
      value={contextValue}
    >
      <div
        className="general-entity-root"
      >
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
              onClick={onCreateForm}
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
            {slots?.leftToolbar && (
              <div
                className="general-entity-slots-left-toolbar"
              >
                { slots.leftToolbar }
              </div>
            )}
          </div>
          <GeneralEntityTable
            bordered
            controller={entityController}
            i18n={i18n}
            loading={isGridLoading}
            onChange={onTableChange}
            pagination={isFiltered ? false : paginationConfig}
            size="small"
            tableConfig={tableConfig}
          />
        </div>
        <div className="right-container">
          {
            id && !_isNil(entityId) && (
              <GeneralEntityForm
                loading={isFormLoading}
                i18n={i18n}
                entityId={parseInt(entityId, 10)}
                formConfig={formConfig}
                form={form}
                formProps={{
                  initialValues,
                  onValuesChange
                }}
              />
            )
          }
        </div>
        <div>{contextHolder}</div>
      </div>
    </GeneralEntityRootProvider>
  );
}

export default GeneralEntityRoot;
