import React from 'react';

import { EntityTable, EntityTableProps } from '../../../Component/Table/EntityTable/EntityTable';
import GenericService from '../../../Service/GenericService/GenericService';
import TableUtil from '../../../Util/TableUtil';

import config from 'shogunApplicationConfig';
import BaseEntity from '../../../Model/BaseEntity';

import './GeneralEntityTable.less';

interface OwnProps<EntityType extends BaseEntity> {
  service: GenericService<EntityType>;
  entityType: string;
  // TODO: table config
}

type GeneralEntityTableProps<EntityType extends BaseEntity> = OwnProps<EntityType> &
  Omit<EntityTableProps, 'service' | 'routePath' | 'name' | 'columns' > & React.HTMLAttributes<HTMLDivElement>;

const columns: any = [
  {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
    sorter: TableUtil.getSorter('id'),
    defaultSortOrder: 'ascend',
    editable: true
  },
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    sorter: TableUtil.getSorter('name'),
    defaultSortOrder: 'ascend',
    editable: true,
    ...TableUtil.getColumnSearchProps('name')
  }
];

export function GeneralEntityTable<EntityType extends BaseEntity> ({
  entityType,
  service
}: GeneralEntityTableProps<EntityType>) {

  return (
    <EntityTable
      className="general-entity-table"
      service={service}
      routePath={`${config.appPrefix}/portal/${entityType}`}
      name={{
        singular: 'Entität',
        plural: 'Entitäten'
      }}
      columns={columns}
      actions={['delete']}
    />
  );
};

export default GeneralEntityTable;
