import {
  useCallback
} from 'react';

import { UrlUtil } from '@terrestris/base-util/dist/UrlUtil/UrlUtil';

import Layer from '@terrestris/shogun-util/dist/model/Layer';
import {
  getBearerTokenHeader
} from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';

import useSHOGunAPIClient from './useSHOGunAPIClient';

export type LocalGeometryType = 'MultiPoint' | 'Point' | 'MultiLineString' | 'LineString' | 'MultiPolygon' | 'Polygon';
export type GeometryType = 'gml:MultiPoint' | 'gml:Point' | 'gml:MultiLineString' |
 'gml:LineString' | 'gml:MultiPolygon' | 'gml:Polygon';

export interface Property {
  localType: 'int' | 'number' | 'string' | 'boolean' | 'date' | LocalGeometryType;
  maxOccurs: 0 | 1;
  minOccurs: 0 | 1;
  name: string;
  nillable: boolean;
  type: 'xsd:int' | 'xsd:number' | 'xsd:string' | 'xsd:boolean' | 'xsd:date' | GeometryType;
}

export interface FeatureType {
  typeName: string;
  properties: Property[];
}

export interface DescribeFeatureType {
  elementFormDefault: string;
  featureTypes: FeatureType[];
  targetNamespace: string;
  targetPrefix: string;
}

export const isGeometryType = (propertyType: string): propertyType is GeometryType => {
  const geometryTypes = [
    'gml:MultiPoint',
    'gml:Point',
    'gml:MultiLineString',
    'gml:LineString',
    'gml:MultiPolygon',
    'gml:Polygon'
  ];

  return geometryTypes.includes(propertyType);
};

export const useExecuteWfsDescribeFeatureType = () => {
  const client = useSHOGunAPIClient();

  const executeWfsDescribeFeatureType = useCallback(async (layer: Layer) => {
    let url = layer.sourceConfig.url;

    if (!url) {
      return;
    }

    if (url.endsWith('?')) {
      url = url.slice(0, -1);
    }

    const params = {
      SERVICE: 'WFS',
      REQUEST: 'DescribeFeatureType',
      VERSION: '2.0.0',
      OUTPUTFORMAT: 'application/json',
      TYPENAMES: layer.sourceConfig.layerNames
    };

    const defaultHeaders = {
      'Content-Type': 'application/json'
    };

    const response = await fetch(`${url}?${UrlUtil.objectToRequestString(params)}`, {
      method: 'GET',
      headers: layer.sourceConfig.useBearerToken ? {
        ...defaultHeaders,
        ...getBearerTokenHeader(client?.getKeycloak())
      } : defaultHeaders
    });

    if (!response.ok) {
      throw new Error('No successful response while executing a WFS DescribeFeatureType');
    }

    return await response.json() as DescribeFeatureType;
  }, [client]);

  return executeWfsDescribeFeatureType;
};

export default useExecuteWfsDescribeFeatureType;
