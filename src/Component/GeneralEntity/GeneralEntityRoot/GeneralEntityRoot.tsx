import './GeneralEntityRoot.less';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  FormOutlined,
  SaveOutlined,
  UndoOutlined,
  UploadOutlined
} from '@ant-design/icons';

import {
  Button,
  Form,
  notification,
  PageHeader,
  Upload
} from 'antd';
import {
  TableProps,
} from 'antd/es/table';
import {
  SortOrder
} from 'antd/es/table/interface';
import {
  RcFile,
  UploadChangeParam
} from 'antd/lib/upload';
import {
  UploadFile
} from 'antd/lib/upload/interface';
import i18next from 'i18next';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';
import {
  NamePath
} from 'rc-field-form/lib/interface';
import {
  UploadRequestOption
} from 'rc-upload/lib/interface';
import {
  useHotkeys
} from 'react-hotkeys-hook';
import {
  useTranslation
} from 'react-i18next';
import {Link,
  matchPath,
  useLocation,
  useNavigate} from 'react-router-dom';
import {
  Shapefile
} from 'shapefile.js';
import config from 'shogunApplicationConfig';

import Logger from '@terrestris/base-util/dist/Logger';
import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import {
  getBearerTokenHeader
} from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';

import {
  ControllerUtil
} from '../../../Controller/ControllerUtil';
import {
  GenericEntityController
} from '../../../Controller/GenericEntityController';
import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import TranslationUtil from '../../../Util/TranslationUtil';
import GeneralEntityForm, {
  FormConfig
} from '../GeneralEntityForm/GeneralEntityForm';
import GeneralEntityTable, {
  TableConfig
} from '../GeneralEntityTable/GeneralEntityTable';

type LayerUploadOptions = {
  baseUrl: string;
  workspace: string;
  storeName: string;
  layerName: string;
  file: RcFile;
};

type LayerUploadResponse = {
  layerName: string;
  workspace: string;
  baseUrl: string;
};

type FeatureTypeAttributes = {
  attribute: {
    name: string;
    minOccurs: number;
    maxOccurs: number;
    nillable: boolean;
    binding?: string;
    length?: number;
  }[];
};

export type GeneralEntityConfigType<T extends BaseEntity> = {
  i18n: FormTranslations;
  endpoint: string;
  entityType: string;
  entityName?: string;
  navigationTitle?: string;
  subTitle?: string;
  formConfig: FormConfig;
  tableConfig: TableConfig<T>;
  onEntitiesLoaded?: (entities: T[], entityType: string) => void;
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
  tableConfig = {},
  onEntitiesLoaded = () => {}
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
  const [isFormLoading, setFormLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [pageTotal, setPageTotal] = useState<number>();
  const [pageSize, setPageSize] = useState<number>(config.defaultPageSize || 10);
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  const [sortField, setSortField] = useState<string>();
  const [sortOrder, setSortOrder] = useState<SortOrder>();
  const [isFiltered, setFiltered] = useState<boolean>(false);

  const [form] = Form.useForm();

  const client = useSHOGunAPIClient();

  const {
    t
  } = useTranslation();

  useEffect(() => {
    setPageCurrent(1);
    setSortOrder('ascend');
  }, [entityType]);

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

  const updateForm = useCallback(async (): Promise<void> => {
    const nameList = formConfig?.fields.filter(field => field.required).map(field => field.dataField);
    validate(nameList);
  }, [formConfig?.fields, validate]);

  const entityController: GenericEntityController<T> = useMemo(() => ControllerUtil.createController({
    endpoint,
    keycloak: client?.getKeycloak(),
    entityType,
    formConfig,
    updateForm
  }), [endpoint, client, entityType, formConfig, updateForm]) as GenericEntityController<T>;

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
    try {
      setGridLoading(true);
      const allEntries = await entityController?.findAll({
        page: pageCurrent - 1,
        size: pageSize,
        sort: {
          properties: _isNil(sortField) ? [] : [sortField],
          order: sortOrder === 'ascend' ? 'asc' : sortOrder === 'descend' ? 'desc' : undefined
        }
      });
      setPageTotal(allEntries.totalElements);
      setEntities(allEntries.content || []);
      onEntitiesLoaded(allEntries.content, entityType);
    } catch (error) {
      Logger.error(error);
    } finally {
      setGridLoading(false);
    }
  }, [entityController, onEntitiesLoaded, entityType, pageCurrent, pageSize, sortField, sortOrder]);

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
  }, [entityType, fetchEntities]);

  const onValuesChange = async (changedValues: any) => {
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

  const onBeforeFileUpload = (file: RcFile) => {
    const maxSize = config.geoserver?.upload?.limit || '200000000';
    const fileType = file.type;
    const fileSize = file.size;

    // 1. Check file size
    if (fileSize > maxSize) {
      notification.error({
        message: t('GeneralEntityRoot.upload.error.message', {
          entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
        }),
        description: t('GeneralEntityRoot.upload.error.descriptionSize', {
          maxSize: maxSize / 1000000
        })
      });

      return false;
    }

    // 2. Check file format
    const supportedFormats = ['application/zip', 'application/x-zip-compressed', 'image/tiff'];
    if (!supportedFormats.includes(fileType)) {
      notification.error({
        message: t('GeneralEntityRoot.upload.error.message', {
          entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
        }),
        description: t('GeneralEntityRoot.upload.error.descriptionFormat', {
          supportedFormats: supportedFormats.join(', ')
        })
      });

      return false;
    }

    return true;
  };

  const uploadGeoTiff = async (options: LayerUploadOptions): Promise<void> => {
    const {
      baseUrl,
      workspace,
      storeName,
      layerName,
      file
    } = options;

    const url = `${baseUrl}/rest/workspaces/${workspace}/coveragestores/` +
      `${storeName}/file.geotiff?coverageName=${layerName}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...getBearerTokenHeader(client?.getKeycloak()),
        'Content-Type': 'image/tiff'
      },
      body: file
    });

    if (!response.ok) {
      throw new Error('No successful response while uploading the file');
    }
  };

  const uploadShapeZip = async (options: LayerUploadOptions): Promise<void> => {
    const {
      baseUrl,
      workspace,
      storeName,
      layerName,
      file
    } = options;

    const shp = await Shapefile.load(file);

    let featureTypeName = '';
    let featureTypeAttributes: FeatureTypeAttributes = {
      attribute: []
    };

    if (Object.entries(shp).length !== 1) {
      throw new Error(t('GeneralEntityRoot.upload.error.descriptionZipContent'));
    }

    Object.entries(shp).forEach(([k, v]) => {
      featureTypeName = k;

      const dbfContent = v.parse('dbf', {
        properties: false
      });

      featureTypeAttributes.attribute = dbfContent.fields.map(field => ({
        name: field.name,
        minOccurs: 0,
        maxOccurs: 1,
        nillable: true,
        binding: getAttributeType(field.type),
        length: field.length
      }));

      const shxContent = v.parse('shx');

      featureTypeAttributes.attribute.push({
        name: 'the_geom',
        minOccurs: 0,
        maxOccurs: 1,
        nillable: true,
        binding: getGeometryType(shxContent.header.type)
      });
    });

    const url = `${baseUrl}/rest/workspaces/${workspace}/datastores/` +
      `${storeName}/file.shp?configure=none`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...getBearerTokenHeader(client?.getKeycloak()),
        'Content-Type': 'application/zip'
      },
      body: file
    });

    if (!response.ok) {
      throw new Error('No successful response while uploading the file');
    }

    const featureTypeUrl = `${baseUrl}/rest/workspaces/${workspace}/datastores/${storeName}/featuretypes`;

    const featureTypeResponse = await fetch(featureTypeUrl, {
      method: 'POST',
      headers: {
        ...getBearerTokenHeader(client?.getKeycloak()),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        featureType: {
          enabled: true,
          name: layerName,
          nativeName: featureTypeName,
          title: layerName,
          attributes: featureTypeAttributes
        }
      })
    });

    if (!featureTypeResponse.ok) {
      throw new Error('No successful response while creating the featuretype');
    }
  };

  const getGeometryType = (geometryTypeNumber: number): string | undefined => {
    const allTypes: {
      [key: number]: string | undefined;
    } = {
      0: undefined, // Null
      1: 'org.locationtech.jts.geom.Point', // Point
      3: 'org.locationtech.jts.geom.LineString', // Polyline
      5: 'org.locationtech.jts.geom.Polygon', // Polygon
      8: 'org.locationtech.jts.geom.MultiPoint', // MultiPoint
      11: 'org.locationtech.jts.geom.Point', // PointZ
      13: 'org.locationtech.jts.geom.LineString', // PolylineZ
      15: 'org.locationtech.jts.geom.Polygon', // PolygonZ
      18: 'org.locationtech.jts.geom.MultiPoint', // MultiPointZ
      21: 'org.locationtech.jts.geom.Point', // PointM
      23: 'org.locationtech.jts.geom.LineString', // PolylineM
      25: 'org.locationtech.jts.geom.Polygon', // PolygonM
      28: 'org.locationtech.jts.geom.MultiPoint', // MultiPointM
      31: undefined // MultiPatch
    };

    return allTypes[geometryTypeNumber];
  };

  const getAttributeType = (dbfFieldType: string) => {
    switch (dbfFieldType) {
      case 'C': // Character
        return 'java.lang.String';
      case 'D': // Date
        return 'java.util.Date';
      case 'N': // Numeric
        return 'java.lang.Long';
      case 'F': // Floating point
        return 'java.lang.Double';
      case 'L': // Logical
        return 'java.lang.Boolean';
      case 'M': // Memo
        return undefined;
      default:
        return undefined;
    }
  };

  const onFileUploadAction = async (options: UploadRequestOption<LayerUploadResponse>) => {
    const {
      onError = () => undefined,
      onSuccess = () => undefined,
      file
    } = options;

    const splittedFileName = (file as RcFile).name.split('.');
    const fileType = (file as RcFile).type;
    const geoServerBaseUrl = config.geoserver?.base || '/geoserver';
    const workspace = config.geoserver?.upload?.workspace || 'SHOGUN';
    const layerName = `${splittedFileName[0]}_${Date.now()}`.toUpperCase();

    const uploadData = {
      file: file as RcFile,
      baseUrl: geoServerBaseUrl,
      workspace: workspace,
      storeName: layerName,
      layerName: layerName
    };

    try {
      if (fileType === 'image/tiff') {
        await uploadGeoTiff(uploadData);
      }

      if (fileType === 'application/zip' || fileType === 'application/x-zip-compressed') {
        await uploadShapeZip(uploadData);
      }

      onSuccess({
        baseUrl: geoServerBaseUrl,
        workspace: workspace,
        layerName: layerName
      });
    } catch (error) {
      onError({
        name: 'UploadError',
        message: (error as Error)?.message
      });
    }
  };

  const onFileUploadChange = async (info: UploadChangeParam<UploadFile<LayerUploadResponse>>) => {
    const file = info.file;

    if (file.status === 'uploading') {
      setIsUploadingFile(true);
    }

    if (file.status === 'done') {
      await client?.layer().add({
        name: file.response?.layerName ?? 'LAYER-DEFAULT-NAME',
        type: 'TILEWMS',
        clientConfig: {
          hoverable: false
        },
        sourceConfig: {
          url: `${file.response?.baseUrl}/ows?`,
          layerNames: `${file.response?.workspace}:${file.response?.layerName}`,
          useBearerToken: true
        }
      });

      // Refresh the list
      await fetchEntities();

      // Finally, show success message
      setIsUploadingFile(false);

      notification.success({
        message: t('GeneralEntityRoot.upload.success.message', {
          entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
        }),
        description: t('GeneralEntityRoot.upload.success.description', {
          fileName: file.fileName,
          layerName: file.response?.layerName
        }),
      });
    } else if (file.status === 'error') {
      setIsUploadingFile(false);

      Logger.error(file.error);

      notification.error({
        message: t('GeneralEntityRoot.upload.error.message', {
          entity: TranslationUtil.getTranslationFromConfig(entityName, i18n)
        }),
        description: t('GeneralEntityRoot.upload.error.description', {
          fileName: file.fileName
        })
      });
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
    setPageCurrent(pagination.current!);
    setPageSize(pagination.pageSize!);

    const anyColumnIsFiltered = Object.keys(filters)
      .some(attribute => !_isNil(filters[attribute]) || !_isEmpty(filters[attribute]));
    setFiltered(anyColumnIsFiltered);
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
              accept='image/tiff,application/zip'
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
          bordered
          controller={entityController}
          entities={allEntities ?? []}
          entityType={entityType}
          fetchEntities={fetchEntities}
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
              entityName={entityName}
              entityType={entityType}
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
    </div>
  );
}

export default GeneralEntityRoot;
