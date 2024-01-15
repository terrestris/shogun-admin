import './LayerPreview.less';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { GlobalOutlined } from '@ant-design/icons';

import { Alert, Modal, ModalProps, Spin, Tooltip } from 'antd';
import Logger from 'js-logger';
import _isNil from 'lodash/isNil';
import OlLayerImage from 'ol/layer/Image';
import OlLayer from 'ol/layer/Layer';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { transformExtent } from 'ol/proj';
import OlSourceImage from 'ol/source/Image';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceTileImage from 'ol/source/TileImage';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlSourceVector from 'ol/source/Vector';
import OlView from 'ol/View';
import { useTranslation } from 'react-i18next';

import LayerUtil from '@terrestris/ol-util/dist/LayerUtil/LayerUtil';
import Layer from '@terrestris/shogun-util/dist/model/Layer';
import SHOGunApplicationUtil from '@terrestris/shogun-util/dist/parser/SHOGunApplicationUtil';
import { getBearerTokenHeader } from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';

import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

import MapComponent from './MapComponent/MapComponent';

function isWmsLayer(layer?: OlLayer): layer is OlLayerImage<OlSourceImageWMS> | OlLayerTile<OlSourceTileWMS> {
  if (_isNil(layer)) {
    return false;
  }
  const source = layer.getSource();
  return source instanceof OlSourceImageWMS || source instanceof OlSourceTileWMS;
}

export interface LayerPreviewProps extends ModalProps {
  layer: Layer;
}

export const LayerPreview: React.FC<LayerPreviewProps> = ({
  layer,
  ...passThroughProps
}) => {
  const [loading, setLoading] = useState(false);
  const [addLayerError, setAddLayerError] = useState<string>();
  const [extentError, setExtentError] = useState<string>();
  const [loadLayerError, setLoadLayerError] = useState<string>();
  const [visible, setVisible] = useState(false);

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

      if (_isNil(olLayer)) {
        return;
      }
      const source = olLayer.getSource();

      if (_isNil(source)) {
        return;
      }

      if (source instanceof OlSourceImage) {
        const imageSource = source as OlSourceImage;
        imageSource.on('imageloaderror', () => {
          setLoadLayerError(t('LayerPreview.loadLayerErrorMsg'));
        });

        imageSource.on('imageloadend', () => setLoadLayerError(undefined));
      }

      if (source instanceof OlSourceTileImage) {
        const tileImageSource = source as OlSourceTileImage;
        tileImageSource.on('tileloaderror', () => {
          setLoadLayerError(t('LayerPreview.loadLayerErrorMsg'));
        });

        tileImageSource.on('tileloadend', () => setLoadLayerError(undefined));
      }

      if (source instanceof OlSourceVector) {
        const vectorSource = source as OlSourceVector<any>;
        vectorSource.on('featuresloaderror', () => {
          setLoadLayerError(t('LayerPreview.loadLayerErrorMsg'));
        });

        vectorSource.on('featuresloadend', () => setLoadLayerError(undefined));
      }
      // @ts-ignore
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
      } else if (olLayer?.getSource() instanceof OlSourceVector) {
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
    setAddLayerError(undefined);
    setExtentError(undefined);
  }, [layer]);

  useEffect(() => {
    addLayer();
  }, [addLayer]);

  const onClick = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
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
        visible={visible}
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
