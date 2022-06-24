import { Button, notification, PageHeader, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  useHistory,
  useLocation,
  matchPath
} from 'react-router-dom';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import ImageFileTable from '../ImageFileTable/ImageFileTable';

import config from 'shogunApplicationConfig';

import './ImageFileRoot.less';

interface OwnProps { }

type ImageFileRootProps = OwnProps;

export const ImageFileRoot: React.FC<ImageFileRootProps> = props => {

  const [fileBlob, setFileBlob] = useState<Blob>();

  const history = useHistory();
  const location = useLocation();
  const client = useSHOGunAPIClient();
  const match = matchPath<{ uuid: string }>(location.pathname, {
    path: `${config.appPrefix}/portal/imagefile/:uuid`
  });
  const imageFileUuid = match?.params?.uuid;

  useEffect(() => {
    if (!imageFileUuid) {
      setFileBlob(null);
      return;
    }

    const fetchImage = async () => {
      const file = await client.imagefile().findOne(imageFileUuid);

      setFileBlob(file);
    };

    fetchImage();
  }, [imageFileUuid, client]);

  return (
    <div className="imagefile-root">
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title="Bilddateien"
        subTitle="… die die Welt zeigen"
      >
      </PageHeader>
      <div className="left-container">
        <div className="left-toolbar">
          <Upload
            key="upload"
            showUploadList={false}
            customRequest={async (options) => {
              const file = options.file;
              if (!(file instanceof File)) {
                return;
              }

              try {
                const uploadedFile = await client.imagefile().upload(file);

                notification.info({
                  message: 'Upload erfolgreich',
                  description: `Die Datei ${file.name} wurde erfolgreich hochgeladen`
                });

                history.push(`${config.appPrefix}/portal/imagefile/${uploadedFile.fileUuid}`);
              } catch (error) {
                notification.error({
                  message: 'Fehler beim Upload',
                  description: `Die Datei ${file.name} konnte nicht hochgeladen werden`
                });
              }
            }}
          >
            <Button type="primary">
              Bilddatei hochladen
            </Button>
          </Upload>
        </div>
        <ImageFileTable />
      </div>
      {
        fileBlob &&
        <div className="right-container">
          <img src={URL.createObjectURL(fileBlob)} />
        </div>
      }
    </div>
  );
};

export default ImageFileRoot;
