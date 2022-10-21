import { InformationModalTableDataType } from '../types';

export const ToolConfigDocTableData: InformationModalTableDataType[] = [
  {
    propertyName: 'name',
    description: 'The name of the tool.',
    example: 'map-tool',
    dataType: 'string',
    mandatory: 'yes',
  },
  {
    propertyName: 'clientConfig',
    description: 'The configuration object of the tool.' ,
    example: '',
    dataType: 'Object',
    mandatory: 'no',
    subProps: [
      {
        propertyName: 'visible',
        description: 'If the tool is visible or not.' ,
        example: 'true',
        dataType: 'boolean',
        mandatory: 'no'
      }
    ]
  }
];
