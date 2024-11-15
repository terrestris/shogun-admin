import React, {
  useState
} from 'react';

import {
  UploadOutlined
} from '@ant-design/icons';

import {
  notification,
  Button,
  Upload
} from 'antd';
import {
  RcFile,
  UploadChangeParam
} from 'antd/lib/upload';
import {
  UploadFile
} from 'antd/lib/upload/interface';
import {
  UploadRequestOption
} from 'rc-upload/lib/interface';
import {
  Shapefile
} from 'shapefile.js';

import { ButtonProps } from 'antd/lib/button';

import {
  getBearerTokenHeader
} from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';

import config from 'shogunApplicationConfig';

import { useTranslation } from 'react-i18next';

import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

import Logger from '../../Logger';

export type LayerUploadOptions = {
  baseUrl: string;
  workspace: string;
  storeName: string;
  layerName: string;
  file: RcFile;
};

export type LayerUploadResponse = {
  layerName: string;
  workspace: string;
  baseUrl: string;
};

export type FeatureTypeAttributes = {
  attribute: {
    name: string;
    minOccurs: number;
    maxOccurs: number;
    nillable: boolean;
    binding?: string;
    length?: number;
  }[];
};

export type UploadLayerButtonProps = Omit<ButtonProps, 'onClick' | 'loading'> & {
  onSuccess?: (layerName?: LayerUploadResponse) => void;
  onError?: (error: any) => void;
}

export const UploadLayerButton: React.FC<UploadLayerButtonProps> = ({
  onSuccess: onSuccessProp,
  onError: onErrorProp,
  ...passThroughProps
}) => {

  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);

  const client = useSHOGunAPIClient();
  const {
    t
  } = useTranslation();

  const onBeforeFileUpload = (file: RcFile) => {
    const maxSize = config.geoserver?.upload?.limit || 200000000;
    const fileType = file.type;
    const fileSize = file.size;

    // 1. Check file size
    if (fileSize > maxSize) {
      notification.error({
        message: t('UploadLayerButton.error.message'),
        description: t('UploadLayerButton.error.descriptionSize', {
          maxSize: maxSize / 1000000
        })
      });

      return false;
    }

    // 2. Check file format
    const supportedFormats = ['application/zip', 'application/x-zip-compressed', 'image/tiff'];
    if (!supportedFormats.includes(fileType)) {
      notification.error({
        message: t('UploadLayerButton.error.message'),
        description: t('UploadLayerButton.error.descriptionFormat', {
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
      throw new Error(t('UploadLayerButton.error.descriptionZipContent'));
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
      onError,
      onSuccess,
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

      onSuccess?.({
        baseUrl: geoServerBaseUrl,
        workspace: workspace,
        layerName: layerName
      });
    } catch (error) {
      onError?.({
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

      setIsUploadingFile(false);

      // Finally, show success message
      notification.success({
        message: t('UploadLayerButton.success.message'),
        description: t('UploadLayerButton.success.description', {
          fileName: file.fileName,
          layerName: file.response?.layerName
        }),
      });

      onSuccessProp?.(file.response);
    } else if (file.status === 'error') {
      setIsUploadingFile(false);

      Logger.error(file.error);

      notification.error({
        message: t('UploadLayerButton.error.message'),
        description: t('UploadLayerButton.error.description', {
          fileName: file.fileName
        })
      });

      onErrorProp?.(file.error);
    }
  };

  return (
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
        icon={<UploadOutlined />}
        loading={isUploadingFile}
        disabled={isUploadingFile}
        {...passThroughProps}
      >
        {t('UploadLayerButton.title')}
      </Button>
    </Upload>
  );
};

export default UploadLayerButton;
