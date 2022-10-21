import { InformationModalTableDataType } from '../types';

export const LayerTreeDocTableData: InformationModalTableDataType[] = [
  {
    propertyName: 'title',
    description: 'The title of the node to show.',
    example: 'Layer A',
    dataType: 'string',
    mandatory: 'no',
  },
  {
    propertyName: 'checked',
    description: 'Whether the node should be checked initially or not.' ,
    example: 'true',
    dataType: 'boolean',
    mandatory: 'no',
  },
  {
    propertyName: 'layerId',
    description: 'The ID of the layer to associate to the node.',
    example: '1909',
    dataType: 'number',
    mandatory: 'no'
  },
  {
    propertyName: 'children',
    description: 'The children configuration. Follows the same scheme mentioned before',
    example: '',
    dataType: 'Object[]',
    mandatory: 'no'
  }
];
