import React from 'react';
import UserService from '../../../Service/UserService/UserService';

import { EntityTable, EntityTableProps } from '../../../Component/Table/EntityTable/EntityTable';
import TableUtil from '../../../Util/TableUtil';

import config from 'shogunApplicationConfig';

interface OwnProps { }

type UserTableProps = OwnProps & Omit<EntityTableProps, 'service' | 'routePath' | 'name' | 'columns' >;
const userService = new UserService();

const columns: any = [
  {
    title: 'Username',
    key: 'username',
    dataIndex: ['providerDetails', 'username'],
    sorter: TableUtil.getSorter('username'),
    defaultSortOrder: 'ascend',
    editable: true,
    ...TableUtil.getColumnSearchProps(['providerDetails', 'username'])
  },
  {
    title: 'Vorname',
    key: 'firstname',
    dataIndex: ['providerDetails', 'firstName'],
    sorter: TableUtil.getSorter('firstname'),
    defaultSortOrder: 'ascend',
    editable: true,
    ...TableUtil.getColumnSearchProps(['providerDetails', 'firstName'])
  },
  {
    title: 'Nachname',
    dataIndex: ['providerDetails', 'lastName'],
    sorter: TableUtil.getSorter('lastname'),
    defaultSortOrder: 'ascend',
    editable: true,
    ...TableUtil.getColumnSearchProps(['providerDetails', 'lastName'])
  }
];

export const UserTable: React.FC<UserTableProps> = props => {

  return (
    <EntityTable
      service={userService}
      routePath={`${config.appPrefix}/portal/user`}
      name={{
        singular: 'Nutzer',
        plural: 'Nutzer'
      }}
      columns={columns}
      actions={['delete']}
      {...props}
    />
  );
};

export default UserTable;
