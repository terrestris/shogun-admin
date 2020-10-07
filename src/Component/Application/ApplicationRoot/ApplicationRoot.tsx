import { Button, PageHeader } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  useHistory,
  useLocation,
  matchPath,
  Link
} from 'react-router-dom';

import ApplicationEditForm from '../ApplicationEditForm/ApplicationEditForm';
import ApplicationTable from '../ApplicationTable/ApplicationTable';

import './ApplicationRoot.less';

interface OwnProps { }

type ApplicationProps = OwnProps;

export const ApplicationRoot: React.FC<ApplicationProps> = props => {

  const [id, setId] = useState<number | 'create'>();

  const history = useHistory();
  const location = useLocation();
  const match = matchPath<{applicationId: string}>(location.pathname, {
    path: '/portal/application/:applicationId'
  });
  const applicationId = match?.params?.applicationId;

  useEffect(() => {
    if (!applicationId) {
      return;
    }
    if (applicationId === 'create') {
      setId(applicationId);
    } else {
      setId(parseInt(applicationId, 10));
    }
  }, [applicationId]);

  return (
    <div className="application-root">
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title="Applikationen"
        subTitle="… die die Welt verändern"
        extra={[
          <Link key="create" to="/portal/application/create">
            <Button type="primary">
              Applikation anlegen
            </Button>
          </Link>
        ]}
      >
      </PageHeader>
      <div className="left-container">
        <ApplicationTable />
      </div>
      <div className="right-container">
        <ApplicationEditForm id={id} />
      </div>
    </div>
  );
};

export default ApplicationRoot;
