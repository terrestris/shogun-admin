import React, {
  useState,
  useEffect,
  useCallback,
  JSX
} from 'react';

import {
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';

import {
  Button,
  Input,
  Modal,
  ModalProps,
  Select,
  Switch,
  Table,
  Tooltip,
  Typography
} from 'antd';

import {
  ColumnsType
} from 'antd/es/table';
import {
  ExpandableConfig
} from 'antd/es/table/interface';
import {
  InputStatus
} from 'antd/lib/_util/statusUtils';

import {
  getUid
} from 'ol';
import ImageLayer from 'ol/layer/Image';
import TileLayer from 'ol/layer/Tile';
import ImageWMSSource from 'ol/source/ImageWMS';
import TileWMSSource from 'ol/source/TileWMS';

import {
  useTranslation
} from 'react-i18next';

import Logger from '@terrestris/base-util/dist/Logger';
import {
  UrlUtil
} from '@terrestris/base-util/dist/UrlUtil/UrlUtil';

import CapabilitiesUtil from '@terrestris/ol-util/dist/CapabilitiesUtil/CapabilitiesUtil';
import LayerUtil from '@terrestris/ol-util/dist/LayerUtil/LayerUtil';

import Layer from '@terrestris/shogun-util/dist/model/Layer';
import {
  getBearerTokenHeader
} from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';

import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

import LayerPreview from '../LayerPreview/LayerPreview';

import './index.less';

export interface ImportResult {
  layers: Layer[];
  errors: {
    layerName: string;
    msg: string;
  }[];
};

type TableRecord = ImageLayer<ImageWMSSource> | TileLayer<TileWMSSource>;

export type AddLayerModalProps = Partial<ModalProps> & {
  onSave?: (result: ImportResult) => void;
};

export const AddLayerModal: React.FC<AddLayerModalProps> = ({
  onCancel,
  open,
  onSave,
  ...restProps
}): JSX.Element => {
  const [layers, setLayers] = useState<(TableRecord)[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [validationStatus, setValidationStatus] = useState<InputStatus>('');
  const [url, setUrl] = useState(`${window.location.origin}/geoserver/ows`);
  const [sanitizedUrl, setSanitizedUrl] = useState<string>();
  const [version, setVersion] = useState<string>('1.3.0');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [existingLayers, setExistingLayers] = useState<Layer[]>([]);
  const [isInternalRequest, setIsInternalRequest] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const client = useSHOGunAPIClient();

  const {
    t
  } = useTranslation();

  const getExistingLayers = useCallback(async () => {
    try {
      setIsLoading(true);

      const existing = await client?.graphql().sendQuery<Layer[]>({
        query:
          'query {' +
          '  allLayers {' +
          '    id' +
          '    name' +
          '    sourceConfig' +
          '  }' +
          '}'
      });

      setExistingLayers(existing?.allLayers || []);
    } catch (error) {
      Logger.error('Error while loading the existing layers ', error);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  const reset = () => {
    setLayers([]);
    setSelectedRowKeys([]);
    setValidationStatus('');
    setUrl(`${window.location.origin}/geoserver/ows`);
    setVersion('1.3.0');
    setIsInternalRequest(false);
    setHasError(false);
  };

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    getExistingLayers();
  }, [open, getExistingLayers]);

  useEffect(() => {
    const validRequestUrl = UrlUtil.createValidGetCapabilitiesRequest(url, 'WMS', version);
    setSanitizedUrl(validRequestUrl.replace('Version', 'VERSION'));
  }, [version, url]);

  const onUrlChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setValidationStatus(UrlUtil.isValid(value.trim()) ? '' : 'error');
    setUrl(evt.target.value);
  };

  const getCapabilities = async () => {
    if (!sanitizedUrl || validationStatus !== '') {
      return;
    }

    try {
      setLayers([]);
      setSelectedRowKeys([]);
      setIsLoading(true);
      setHasError(false);

      const capabilities = await CapabilitiesUtil.getWmsCapabilities(sanitizedUrl, {
        headers: isInternalRequest ? {
          ...getBearerTokenHeader(client?.getKeycloak())
        } : {}
      });

      const externalLayers = CapabilitiesUtil.getLayersFromWmsCapabilities(capabilities, 'Title')?.filter(l => {
        return l.getSource()?.getParams().LAYERS !== undefined;
      });

      setLayers(externalLayers);
    } catch (error) {
      setHasError(true);

      Logger.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterExistingLayers = (record: TableRecord) => {
    return existingLayers.filter(existingLayer => {
      return existingLayer.sourceConfig?.layerNames === record.getSource()?.getParams().LAYERS;
    });
  };

  const closeModal = (evt: React.MouseEvent<HTMLButtonElement>) => {
    onCancel?.(evt);
  };

  const onAddSelected = () => {
    const layersToAdd = layers.filter(layer => selectedRowKeys.includes(getUid(layer)));
    addLayers(layersToAdd);
  };

  const onAddAll = () => {
    addLayers(layers);
  };

  const toShogunLayer = useCallback((layer: TableRecord): Layer | undefined => {
    const layerName = layer.getSource()?.getParams().LAYERS;
    const type = layer instanceof ImageLayer ? 'WMS' : 'TILEWMS';
    const lUrl = layer instanceof ImageLayer ? layer.getSource()?.getUrl() : layer.getSource()?.getUrls()?.[0];
    const attribution = LayerUtil.getLayerAttributionsText(layer);

    if (!lUrl) {
      Logger.error('Could not get URL for layer');

      return;
    }

    return {
      name: layer.get('name'),
      type: type,
      sourceConfig: {
        url: lUrl,
        layerNames: layerName,
        useBearerToken: isInternalRequest,
        attribution: (attribution && attribution !== 'undefined') ? attribution : undefined,
        requestParams: {
          VERSION: version
        }
      },
      clientConfig: {
        hoverable: layer.get('queryable') === '1'
      }
    };
  }, [isInternalRequest, version]);

  const addLayers = useCallback(async (layersToAdd: (TableRecord)[]) => {
    setIsLoading(true);

    const result: ImportResult = {
      layers: [],
      errors: []
    };

    for (const layer of layersToAdd) {
      const layerName = layer.getSource()?.getParams().LAYERS;
      const layerConf = toShogunLayer(layer);

      if (!layerConf) {
        result.errors.push({
          layerName: layerName,
          msg: `Could not get URL for layer ${layerName}`
        });

        continue;
      }

      try {
        const addedLayer = await client?.layer().add(layerConf);

        if (!addedLayer) {
          result.errors.push({
            layerName: layerName,
            msg: 'Unknown error while adding the layer'
          });

          continue;
        }

        result.layers.push(addedLayer);
      } catch (error) {
        Logger.error(`Error while adding the layer ${layerName}:`, error);

        result.errors.push({
          layerName: layer.getSource()?.getParams().LAYERS,
          msg: `Error while adding the layer ${layerName}: ${error}`
        });
      }
    }

    onSave?.(result);

    setIsLoading(false);
  }, [onSave, toShogunLayer, client]);

  const onUseBearerTokenChange = (checked: boolean) => {
    setIsInternalRequest(checked);
  };

  const footerButtons = [
    <Button
      aria-label="add-all"
      key="add-all"
      disabled={layers?.length < 1}
      loading={isLoading}
      onClick={onAddAll}
    >
      {t('AddLayerModal.addAllLayers')}
    </Button>,
    <Button
      aria-label="add-selected"
      key="add-selected"
      disabled={selectedRowKeys?.length < 1}
      loading={isLoading}
      onClick={onAddSelected}
    >
      {t('AddLayerModal.addSelectedLayers')}
    </Button>
  ];

  const columns: ColumnsType<TableRecord> = [{
    title: t('AddLayerModal.columnName'),
    render: (_, record) => record.getSource()?.getParams()?.LAYERS,
    sorter: (a, b) => a.getSource()?.getParams()?.LAYERS.localeCompare(b.getSource()?.getParams()?.LAYERS),
    defaultSortOrder: 'ascend'
  }, {
    title: t('AddLayerModal.columnTitle'),
    render: (_, record) => record.get('title'),
    sorter: (a, b) => a.get('title').localeCompare(b.get('title')),
    defaultSortOrder: 'ascend'
  }, {
    title: t('AddLayerModal.columnExisting'),
    width: 125,
    render: (_, record) => {
      const filtered = filterExistingLayers(record);

      return filtered.length > 0 ?
        <CheckOutlined /> :
        <CloseOutlined />;
    },
    className: 'operation-column',
    sorter: (a, b) => {
      const aExists = filterExistingLayers(a).length > 0;
      const bExists = filterExistingLayers(b).length > 0;

      if (aExists && !bExists) {
        return -1;
      }

      if (!aExists && bExists) {
        return 1;
      }

      return 0;
    },
    defaultSortOrder: 'descend'
  }, {
    title: t('AddLayerModal.columnPreview'),
    width: 125,
    render: (_, record) => {
      const layerConf = toShogunLayer(record);

      if (!layerConf) {
        return;
      }

      // Set a dummy ID to the layer configuration to make the LayerPreview work.
      layerConf.id = 1909;

      return (
        <LayerPreview
          layer={layerConf}
        />
      );
    },
    className: 'operation-column'
  }];

  const expandable: ExpandableConfig<TableRecord> = {
    expandedRowRender: record => {
      const cand = filterExistingLayers(record);

      return (
        <div
          className="expanded-row"
        >
          {t('AddLayerModal.existingLayerNote', {
            layerName: record.getSource()?.getParams().LAYERS
          })}
          <ul>
            {
              cand
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(c => (
                  <li
                    key={c.id}
                  >
                    <a
                      href={`portal/layer/${c.id}`}
                      target="_blank"
                    >
                      {`${c.name} (${c.id})`}
                    </a>
                  </li>
                ))
            }
          </ul>
        </div>
      );
    },
    rowExpandable: record => filterExistingLayers(record).length > 0
  };

  return (
    <Modal
      className="add-layer-modal"
      title={t('AddLayerModal.title')}
      onCancel={closeModal}
      width={600}
      open={open}
      footer={footerButtons}
      {...restProps}
    >
      <span>{t('AddLayerModal.requestWmsGetCapabilitiesInstruction')}</span>
      <div
        className="input-wrapper"
      >
        <Input.Search
          aria-label="input-search"
          className="url-input"
          placeholder={t('AddLayerModal.inputPlaceholder')}
          value={url}
          onChange={onUrlChange}
          onSearch={getCapabilities}
          loading={isLoading}
          status={validationStatus}
          enterButton={true}
          addonBefore={
            <Select
              aria-label="select-version"
              defaultValue="1.3.0"
              onChange={setVersion}
              value={version}
              options={[{
                key: '1.3.0',
                value: '1.3.0',
                label: `${t('AddLayerModal.version', {
                  version: '1.3.0'
                })}`
              }, {
                key: '1.1.1',
                value: '1.1.1',
                label: `${t('AddLayerModal.version', {
                  version: '1.1.1'
                })}`
              }, {
                key: '1.1.0',
                value: '1.1.0',
                label: `${t('AddLayerModal.version', {
                  version: '1.1.0'
                })}`
              }, {
                key: '1.0.0',
                value: '1.0.0',
                label: `${t('AddLayerModal.version', {
                  version: '1.0.0'
                })}`
              }]}
            >
            </Select>
          }
        />
        <Tooltip
          title={t('AddLayerModal.useBearerTokenTooltip')}
        >
          <Switch
            aria-label="use-bearer-token"
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={onUseBearerTokenChange}
            value={isInternalRequest}
          />
        </Tooltip>
        <label>
          {t('AddLayerModal.useBearerTokenLabel')}
        </label>
      </div>
      {
        (validationStatus !== '' || hasError) && (
          <Typography
            className="error"
          >
            {validationStatus ? t('AddLayerModal.invalidUrlErrorMsg') : t('AddLayerModal.errorDescription')}
          </Typography>
        )
      }
      {
        !hasError && (
          <Table<TableRecord>
            aria-label="wms-table"
            loading={isLoading}
            size="small"
            columns={columns}
            scroll={{
              y: 'calc(100vh - 400px)'
            }}
            expandable={expandable}
            rowKey={getUid}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys
            }}
            pagination={false}
            dataSource={layers}
          />
        )
      }
    </Modal>
  );
};

export default AddLayerModal;
