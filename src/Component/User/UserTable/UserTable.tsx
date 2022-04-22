import React from 'react';
import UserService from '../../../Service/UserService/UserService';

import { EntityTable, EntityTableProps } from '../../../Component/Table/EntityTable/EntityTable';
import TableUtil from '../../../Util/TableUtil';

import config from 'shogunApplicationConfig';

interface OwnProps { }

type UserTableProps = OwnProps & Omit<EntityTableProps, 'service' | 'routePath' | 'name' | 'columns' >;
const userService = new UserService(config.path.user);

const columns: any = [
  {
    title: 'Provider Id',
    key: 'authProviderId',
    dataIndex: 'authProviderId',
    sorter: TableUtil.getSorter('authProviderId'),
    defaultSortOrder: 'ascend',
    editable: false,
    ...TableUtil.getColumnSearchProps('authProviderId')
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
