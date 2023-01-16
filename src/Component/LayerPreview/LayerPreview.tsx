import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  useTranslation
} from 'react-i18next';

import OlMap from 'ol/Map';
import OlLayer from 'ol/layer/Layer';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceWMTS from 'ol/source/WMTS';
import OlSourceVector from 'ol/source/Vector';
import OlView from 'ol/View';
import {
  transformExtent
} from 'ol/proj';

import SHOGunApplicationUtil from '@terrestris/shogun-util/dist/parser/SHOGunApplicationUtil';
import Layer from '@terrestris/shogun-util/dist/model/Layer';
import {
  getBearerTokenHeader
} from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';

import LayerUtil from '@terrestris/ol-util/dist/LayerUtil/LayerUtil';

import Logger from 'js-logger';

import {
  Alert,
  Modal,
  ModalProps,
  Spin,
  Tooltip
} from 'antd';

import {
  GlobalOutlined
} from '@ant-design/icons';

import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

import MapComponent from './MapComponent/MapComponent';

import './LayerPreview.less';

function isWmsLayer(layer: OlLayer): layer is OlLayerImage<OlSourceImageWMS> | OlLayerTile<OlSourceTileWMS> {
  if (layer instanceof OlLayer) {
    const source = layer.getSource();
    return source instanceof OlSourceImageWMS || source instanceof OlSourceTileWMS;
  }
  return false;
}

export interface LayerPreviewProps extends ModalProps {
  layer: Layer;
};

export const LayerPreview: React.FC<LayerPreviewProps> = ({
  layer,
  ...passThroughProps
}) => {
  const [loading, setLoading] = useState(false);
  const [addLayerError, setAddLayerError] = useState<string>();
  const [extentError, setExtentError] = useState<string>();
  const [loadLayerError, setLoadLayerError] = useState<string>();
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  const client = useSHOGunAPIClient();

  const parser = useMemo(() => {
    return new SHOGunApplicationUtil({
      client: client
    });
  }, [client]);

  const map = useMemo(() => {
    return new OlMap({
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM()
        })
      ],
      target: '',
      view: new OlView({
        center: [0, 0],
        zoom: 0
      })
    });
  }, []);

  const addLayer = useCallback(async () => {
    if (!layer) {
      return;
    }

    try {
      const olLayer = await parser.parseLayer(layer);
      const layers = map.getAllLayers();
      layers
        .filter(l => l.get('shogunId') === layer.id)
        .forEach(l => map.removeLayer(l));

      const source = olLayer.getSource();

      if (source instanceof OlSourceImageWMS) {
        source.on('imageloaderror', (a) => {
          setLoadLayerError(t('LayerPreview.loadLayerErrorMsg'));
        });

        source.on('imageloadend', (a) => {
          setLoadLayerError(null);
        });
      }

      if (source instanceof OlSourceTileWMS || source instanceof OlSourceWMTS) {
        source.on('tileloaderror', (a) => {
          setLoadLayerError(t('LayerPreview.loadLayerErrorMsg'));
        });

        source.on('tileloadend', (a) => {
          setLoadLayerError(null);
        });
      }

      if (source instanceof OlSourceVector) {
        source.on('featuresloaderror', (a) => {
          setLoadLayerError(t('LayerPreview.loadLayerErrorMsg'));
        });

        source.on('featuresloadend', (a) => {
          setLoadLayerError(null);
        });
      }

      map.addLayer(olLayer);
    } catch (e) {
      Logger.error(e);
      setAddLayerError(t('LayerPreview.addLayerErrorMsg'));
    }
  }, [map, layer, parser, t]);

  const zoomToLayer = useCallback(async () => {
    try {
      setLoading(true);

      const olLayer = map.getAllLayers()
        .find(l => l.get('shogunId') === layer.id);

      if (isWmsLayer(olLayer)) {
        let extent = await LayerUtil.getExtentForLayer(olLayer, {
          headers: olLayer.get('useBearerToken') ? {
            ...getBearerTokenHeader(client?.getKeycloak())
          } : {}
        });
        extent = transformExtent(extent, 'EPSG:4326', map.getView().getProjection());
        map.getView().fit(extent);
      } else if (olLayer.getSource() instanceof OlSourceVector) {
        const source = olLayer.getSource() as OlSourceVector;
        source.on('addfeature', () => {
          map.getView().fit(source.getExtent());
        });
      } else {
        setExtentError(t('LayerPreview.extentNotSupportedErrorMsg'));
      }
    } catch (e) {
      Logger.error(e);
      setExtentError(t('LayerPreview.extentErrorMsg'));
    } finally {
      setLoading(false);
    }
  }, [map, layer, client, t]);

  useEffect(() => {
    setAddLayerError(null);
    setExtentError(null);
  }, [layer]);

  useEffect(() => {
    addLayer();
  }, [addLayer]);

  const onClick = () => {
    setOpen(true);
  };

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip
        title={t('LayerPreview.tooltipTitle')}
      >
        <GlobalOutlined
          className="layer-preview-button"
          onClick={onClick}
        />
      </Tooltip>
      <Modal
        className="layer-preview-modal"
        title={t('LayerPreview.title', {
          layerName: layer.name
        })}
        visible={open}
        onCancel={onCancel}
        footer={false}
        {...passThroughProps}
      >
        {
          (addLayerError || extentError || loadLayerError) && (
            <Alert
              message={
                <ul>
                  {
                    [
                      addLayerError,
                      extentError,
                      loadLayerError
                    ]
                      .filter(error => !!error)
                      .map(error => <li key={error}>{error}</li>)
                  }
                </ul>
              }
              type="warning"
              showIcon
            />
          )
        }
        <Spin
          spinning={loading}
        >
          <MapComponent
            id="preview-map"
            map={map}
            onRender={zoomToLayer}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default LayerPreview;
