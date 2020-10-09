import { Button, PageHeader } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  useHistory,
  useLocation,
  matchPath,
  Link
} from 'react-router-dom';

import UserTable from '../UserTable/UserTable';

import './UserRoot.less';

interface OwnProps { }

type UserRootProps = OwnProps;

export const UserRoot: React.FC<UserRootProps> = props => {

  const [id, setId] = useState<number | 'create'>();

  const history = useHistory();
  const location = useLocation();
  const match = matchPath<{userId: string}>(location.pathname, {
    path: '/portal/layer/:userId'
  });
  const userId = match?.params?.userId;

  useEffect(() => {
    if (!userId) {
      return;
    }
    if (userId === 'create') {
      setId(userId);
    } else {
      setId(parseInt(userId, 10));
    }
  }, [userId]);

  return (
    <div className="user-root">
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title="User"
        subTitle="… die die Welt verbessern"
        extra={[
          <Link key="create" to="/portal/user/create">
            <Button type="primary">
              User anlegen
            </Button>
          </Link>
        ]}
      >
      </PageHeader>
      <div className="left-container">
        <UserTable />
      </div>
      <div className="right-container">
        {id}
        {/* TODO: */}
        {/* <LayerEditForm id={id} /> */}
      </div>
    </div>
  );
};

export default UserRoot;
