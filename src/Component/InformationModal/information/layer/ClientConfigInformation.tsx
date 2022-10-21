import { InformationModalTableDataType } from './../../types';

export const description = 'A small description about this field. Still TODO';

export const ClientConfigDocTableData: InformationModalTableDataType[] = [

  {
    propertyName: 'minResolution',
    description: 'The minimum resolution of the layer (at what resolution/zoom level the layer should become visible).',
    example: '305.74811309814453',
    dataType: 'number',
    required: 'no',
  },
  {
    propertyName: 'maxResolution',
    description: 'The maximum resolution of the layer (to which resolution/zoom level the layer should be visible).',
    example: '2500',
    dataType: 'number',
    required: 'no',
  },
  {
    propertyName: 'hoverable',
    description: 'Whether the layer is hoverable or not.',
    example: 'true',
    dataType: 'boolean',
    required: 'no',
  },
  {
    propertyName: 'searchable',
    description: 'Whether the layer is searchable or not.',
    example: 'true',
    dataType: 'boolean',
    required: 'no',
  },
  {
    propertyName: 'downloadConfig',
    description: 'List of download configurations.',
    example: '1',
    dataType: 'Object[]',
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
    required: 'no',
  },
  {
    propertyName: 'opacity',
    description: 'The default opacity of the layer.',
    example: '1',
    dataType: 'number between 0 and 1',
    required: 'no',
  }
];

export const exampleConfig = `
  {
    "hoverable": true
  }
`;
