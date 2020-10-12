import React from 'react';

import { EntityTable, EntityTableProps } from '../../../Component/Table/EntityTable/EntityTable';
import ApplicationService from '../../../Service/ApplicationService/ApplicationService';
import TableUtil from '../../../Util/TableUtil';

interface OwnProps { }

type ApplicationTableProps = OwnProps & Omit<EntityTableProps, 'service' | 'routePath' | 'name' | 'columns' >;
const applicationService = new ApplicationService();

const columns: any = [
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

export const ApplicationTable: React.FC<ApplicationTableProps> = props => {

  return (
    <EntityTable
      service={applicationService}
      routePath={'/portal/application'}
      name={{
        singular: 'Applikation',
        plural: 'Applilkationen'
      }}
      columns={columns}
      actions={['delete']}
      {...props}
    />
  );
};

export default ApplicationTable;
