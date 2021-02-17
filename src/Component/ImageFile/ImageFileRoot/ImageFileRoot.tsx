import { Button, PageHeader } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  useHistory,
  useLocation,
  matchPath,
  Link
} from 'react-router-dom';

import config from 'shogunApplicationConfig';

// import ImageFileEditForm from '../ImageFileEditForm/ImageFileEditForm';
import ImageFileTable from '../ImageFileTable/ImageFileTable';
import './ImageFileRoot.less';

interface OwnProps { }

type ImageFileRootProps = OwnProps;

export const ImageFileRoot: React.FC<ImageFileRootProps> = props => {

  const [uuid, setUuid] = useState<string | 'create'>();

  const history = useHistory();
  const location = useLocation();
  const match = matchPath<{ uuid: string }>(location.pathname, {
    path: `${config.appPrefix}/portal/imagefile/:uuid`
  });
  const imageFileUuid = match?.params?.uuid;

  useEffect(() => {
    if (!imageFileUuid) {
      setUuid(undefined);
      return;
    }
    setUuid(imageFileUuid);
  }, [imageFileUuid]);

  return (
    <div className="imagefile-root">
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title="Bilddateien"
        subTitle="… die die Welt zeigen"
        extra={[
          <Link key="create" to={`${config.appPrefix}/portal/imagefile/create`}>
            <Button type="primary">
              Bilddatei hochladen
            </Button>
          </Link>
        ]}
      >
      </PageHeader>
      <div className="left-container">
        <ImageFileTable />
      </div>
      {
        uuid &&
        <div className="right-container">
          <img src={`${config.path.imageFile}/${uuid}`} />
          {/* <ImageFileEditForm uuid={uuid} /> */}
        </div>
      }
    </div>
  );
};

export default ImageFileRoot;
