import React from 'react';
import UserService from '../../../Service/UserService/UserService';

import { EntityTable, EntityTableProps } from '../../../Component/Table/EntityTable/EntityTable';
import TableUtil from '../../../Util/TableUtil';

interface OwnProps { }

type UserTableProps = OwnProps & Omit<EntityTableProps, 'service' | 'routePath' | 'name' | 'columns' >;
const userService = new UserService();

const columns: any = [
  {
    title: 'Username',
    key: 'username',
    dataIndex: ['keycloakRepresentation', 'username'],
    sorter: TableUtil.getSorter('username'),
    defaultSortOrder: 'ascend',
    editable: true,
    ...TableUtil.getColumnSearchProps(['keycloakRepresentation', 'username'])
  },
  {
    title: 'Vorname',
    key: 'firstname',
    dataIndex: ['keycloakRepresentation', 'firstName'],
    sorter: TableUtil.getSorter('firstname'),
    defaultSortOrder: 'ascend',
    editable: true,
    ...TableUtil.getColumnSearchProps(['keycloakRepresentation', 'firstName'])
  },
  {
    title: 'Nachname',
    dataIndex: ['keycloakRepresentation', 'lastName'],
    sorter: TableUtil.getSorter('lastname'),
    defaultSortOrder: 'ascend',
    editable: true,
    ...TableUtil.getColumnSearchProps(['keycloakRepresentation', 'lastName'])
  }
];

export const UserTable: React.FC<UserTableProps> = props => {

  return (
    <EntityTable
      service={userService}
      routePath={'/portal/user'}
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
