import { InformationModalTableDataType } from './../../types';

export const description = 'A small description about this field. Still TODO';

export const LayerConfigurationDocTableData: InformationModalTableDataType[] = [
  {
    propertyName: 'layerId',
    description: 'The ID of the layer to apply the custom configuration to.',
    example: '1',
    dataType: 'number',
    required: 'yes',
  },
  {
    propertyName: 'clientConfig',
    description: 'The configuration of the layer which should be used to define client specific aspects of the layer. This may include the name, the visible resolution range, search configurations or similar.' ,
    example: '',
    dataType: 'Object',
    required: 'no',
    subProps: [
      {
        propertyName: 'minResolution',
        description: 'The minimum resolution of the layer (at what resolution/zoom level the layer should become visible).',
        example: '305.74811309814453',
        dataType: 'number',
        required: 'no'
      },
      {
        propertyName: 'maxResolution',
        description: 'The maximum resolution of the layer (to which resolution/zoom level the layer should be visible).',
        example: '2500',
        dataType: 'number',
        required: 'no'
      },
      {
        propertyName: 'hoverable',
        description: 'Whether the layer is hoverable or not.',
        example: 'true',
        dataType: 'boolean',
        required: 'no'
      },
      {
        propertyName: 'searchable',
        description: 'Whether the layer is searchable or not.',
        example: 'true',
        dataType: 'boolean',
        required: 'no'
      },
      {
        propertyName: 'propertyConfig',
        description: 'The property configuration.',
        example: '',
        dataType: 'Object[]',
        required: 'no',
        subProps: [
          {
            propertyName: 'propertyName',
            description: 'The name of the property.',
            example: 'description',
            dataType: 'string',
            required: 'yes'
          },
          {
            propertyName: 'displayName',
            description: 'The name of the attribute to show.',
            example: 'Description',
            dataType: 'string',
            required: 'no'
          },
          {
            propertyName: 'visible',
            description: 'Whether the attribute should be shown or not.',
            example: 'true',
            dataType: 'boolean',
            required: 'no'
          }
        ]
      },
      {
        propertyName: 'crossOrigin',
        description: 'The cross Origin mode to use.',
        example: 'anonymous',
        dataType: 'string',
        required: 'no'
      },
      {
        propertyName: 'opacity',
        description: 'The default opacity of the layer.',
        example: '1',
        dataType: 'number between 0 and 1',
        required: 'no'
      },
      {
        propertyName: 'downloadConfig',
        description: 'List of download configurations.',
        example: 'Object[]',
        dataType: 'List of objects',
        required: 'no',
        subProps: [
          {
            propertyName: 'downloadUrl',
            description: 'URL which allows to download the layer data.',
            example: 'https://example.com/geoserver/SHOGUN/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application%2Fjson',
            dataType: 'string',
            required: 'yes'
          },
          {
            propertyName: 'formatName',
            description: 'The displayed format name for the given downloadUrl.',
            example: 'GeoJSON',
            dataType: 'string',
            required: 'no'
          }
        ]
      },
      {
        propertyName: 'searchConfig',
        description: 'The search configuration.',
        example: '',
        dataType: 'Object[]',
        required: 'no',
      }
    ]
  },
  {
    propertyName: 'sourceConfig',
    description: 'The configuration of the datasource of the layer, e.g. the URL of the server, the name or the grid configuration.' ,
    example: '',
    dataType: 'Object',
    required: 'no',
    subProps: [
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
    ]
  }
];

export const exampleConfig = `
  [
    {
      "layerId": 47,
      "clientConfig": {
        "opacity": 30
      }
    }
  ]
`;
