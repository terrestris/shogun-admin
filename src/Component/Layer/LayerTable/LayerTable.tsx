import React from 'react';

import { EntityTable, EntityTableProps } from '../../../Component/Table/EntityTable/EntityTable';
import LayerService from '../../../Service/LayerService/LayerService';
import TableUtil from '../../../Util/TableUtil';

import config from 'shogunApplicationConfig';

interface OwnProps { }

type LayerTableProps = OwnProps & Omit<EntityTableProps, 'service' | 'routePath' | 'name' | 'columns' >;
const layerService = new LayerService();

const columns: any = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    sorter: TableUtil.getSorter('name'),
    defaultSortOrder: 'ascend',
    editable: true,
    ...TableUtil.getColumnSearchProps('name')
  },
  {
    title: 'Typ',
    key: 'type',
    dataIndex: 'type',
    sorter: TableUtil.getSorter('type'),
    defaultSortOrder: 'ascend',
    editable: true,
    ...TableUtil.getColumnSearchProps('type')
  }
];

export const LayerTable: React.FC<LayerTableProps> = props => {

  return (
    <EntityTable
      service={layerService}
      routePath={`${config.appPrefix}/portal/layer`}
      name={{
        singular: 'Thema',
        plural: 'Themen'
      }}
      columns={columns}
      actions={['delete']}
      {...props}
    />
  );
};

export default LayerTable;
