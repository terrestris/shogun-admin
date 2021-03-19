import { Button, PageHeader } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  useHistory,
  useLocation,
  matchPath,
  Link
} from 'react-router-dom';

import LayerTable from '../LayerTable/LayerTable';
import LayerEditForm from '../LayerEditForm/LayerEditForm';

import config from 'shogunApplicationConfig';

import './LayerRoot.less';

interface OwnProps { }

type LayerRootProps = OwnProps;

export const LayerRoot: React.FC<LayerRootProps> = props => {

  const [id, setId] = useState<number | 'create'>();

  const history = useHistory();
  const location = useLocation();
  const match = matchPath<{layerId: string}>(location.pathname, {
    path: `${config.appPrefix}/portal/layer/:layerId`
  });
  const layerId = match?.params?.layerId;

  useEffect(() => {
    if (!layerId) {
      return;
    }
    if (layerId === 'create') {
      setId(layerId);
    } else {
      setId(parseInt(layerId, 10));
    }
  }, [layerId]);

  return (
    <div className="layer-root">
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title="Themen"
        subTitle="… die die Welt bewegen"
        extra={[
          <Link
            key="create"
            to={`${config.appPrefix}/portal/layer/create`}
          >
            <Button
              type="primary"
            >
              Layer anlegen
            </Button>
          </Link>
        ]}
      >
      </PageHeader>
      <div
        className="left-container"
      >
        <LayerTable />
      </div>
      {
        id &&
        <div
          className="right-container"
        >
          <LayerEditForm
            id={id}
          />
        </div>
      }
    </div>
  );
};

export default LayerRoot;
