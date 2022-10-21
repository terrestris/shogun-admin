import { InformationModalTableDataType } from './../../types';

export const description = 'A small description about this field. Still TODO';

export const SourceConfigurationDocTableData: InformationModalTableDataType[] = [
  {
    propertyName: 'url',
    description: 'The base URL of the layer.' ,
    example: 'https://ows.terrestris.de/ows',
    dataType: 'string',
    required: 'no'
  },
  {
    propertyName: 'layerNames',
    description: 'A comma separated list of layers to request.' ,
    example: 'layerA',
    dataType: 'string',
    required: 'no'
  },
  {
    propertyName: 'legendUrl',
    description: 'A custom legend URL.' ,
    example: 'https://ows.terrestris.de/ows/my-legend.png',
    dataType: 'string',
    required: 'no'
  },
  {
    propertyName: 'tileSize',
    description: 'The tile size.' ,
    example: '512',
    dataType: 'number',
    required: 'no'
  },
  {
    propertyName: 'tileOrigin',
    description: 'The tile origin.' ,
    example: '[239323.44497139292, 4290144.074117256]',
    dataType: '[number, number]',
    required: 'no'
  },
  {
    propertyName: 'matrixSet',
    description: 'The matrix set identifier, which should be used with the WMTS layer source.' ,
    example: 'WEBMERCATOR',
    dataType: 'string',
    required: 'no'
  },
  {
    propertyName: 'resolutions',
    description: 'The list of resolutions the layer should be requested on.' ,
    example: '[2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508]',
    dataType: 'number[]',
    required: 'no'
  },
  {
    propertyName: 'attribution',
    description: 'The attribution to show.' ,
    example: '© by terrestris GmbH & Co. KG',
    dataType: 'string',
    required: 'no'
  },
  {
    propertyName: 'requestParams',
    description: 'Request parameters to be passed to the service when querying a layer.' ,
    example: '{\"transparent\": true}',
    dataType: 'Object',
    required: 'no'
  },
  {
    propertyName: 'useBearerToken',
    description: 'Whether to send the (internal) Keycloak Bearer Token alongside the map requests or not. Please note: This should be set to `true` for internal layers only!' ,
    example: 'false',
    dataType: 'boolean',
    required: 'no'
  }
];

export const exampleConfig = `
  {
    "url": "https://ows.terrestris.de/osm/service?",
    "layerNames": "OSM-WMS",
    "attribution": "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap contributors</a>",
    "useBearerToken": false
  }
`;
