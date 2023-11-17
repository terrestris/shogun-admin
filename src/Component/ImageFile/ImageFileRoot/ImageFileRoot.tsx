import './ImageFileRoot.less';

import { Button, notification, PageHeader, Upload } from 'antd';
import _isNil from 'lodash/isNil';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {matchPath,
  useLocation,
  useNavigate} from 'react-router-dom';
import config from 'shogunApplicationConfig';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import ImageFileTable from '../ImageFileTable/ImageFileTable';

interface OwnProps { }

type ImageFileRootProps = OwnProps;

export const ImageFileRoot: React.FC<ImageFileRootProps> = () => {

  const [fileBlob, setFileBlob] = useState<Blob>();

  const navigate = useNavigate();
  const location = useLocation();
  const client = useSHOGunAPIClient();
  const match = matchPath({
    path: `${config.appPrefix}/portal/imagefile/:uuid`
  }, location.pathname);
  const imageFileUuid = match?.params?.uuid;

  const {
    t
  } = useTranslation();

  useEffect(() => {
    if (!imageFileUuid) {
      setFileBlob(undefined);
      return;
    }

    const fetchImage = async () => {
      const file = await client?.imagefile().findOne(imageFileUuid);

      setFileBlob(file);
    };

    fetchImage();
  }, [imageFileUuid, client]);

  return (
    <div className="imagefile-root">
      <PageHeader
        className="header"
        onBack={() => navigate(-1)}
        title={t('ImageFileRoot.title')}
        subTitle={t('ImageFileRoot.subTitle')}
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
                const uploadedFile = await client?.imagefile().upload(file);
                if (!_isNil(uploadedFile)) {
                  notification.info({
                    message: t('ImageFileRoot.success'),
                    description: t('ImageFileRoot.uploadSuccess', { entityName: file.name })
                  });
                  navigate(`${config.appPrefix}/portal/imagefile/${uploadedFile.fileUuid}`);
                }
              } catch (error) {
                notification.error({
                  message: t('ImageFileRoot.failure'),
                  description: t('ImageFileRoot.uploadFailure', { entityName: file.name })
                });
              }
            }}
          >
            <Button type="primary">
              {t('ImageFileRoot.button')}
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
