import './ImageFileRoot.less';

import React from 'react';

import { PageHeader } from '@ant-design/pro-components';
import { Button, notification, Upload } from 'antd';
import _isNil from 'lodash/isNil';
import { useTranslation } from 'react-i18next';
import {
  matchPath,
  useLocation,
  useNavigate
} from 'react-router-dom';
import config from 'shogunApplicationConfig';

import logger from '@terrestris/base-util/dist/Logger';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import ImageFileForm from '../ImageFileForm/ImageFileForm';
import ImageFileTable from '../ImageFileTable/ImageFileTable';

interface OwnProps { }

type ImageFileRootProps = OwnProps;

export const ImageFileRoot: React.FC<ImageFileRootProps> = () => {

  const navigate = useNavigate();

  const location = useLocation();
  const client = useSHOGunAPIClient();
  const match = matchPath({
    path: `${config.appPrefix}/portal/imagefile/:id`
  }, location.pathname);
  const imageFileId = match?.params?.id;

  const {
    t
  } = useTranslation();

  return (
    <div className="imagefile-root">
      <PageHeader
        className="header"
        onBack={() => navigate(-1)}
        title={t('ImageFileRoot.title')}
        subTitle={t('ImageFileRoot.subTitle')}
      />
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
                  navigate(`${config.appPrefix}/portal/imagefile/${uploadedFile.id}`);
                }
              } catch (error) {
                notification.error({
                  message: t('ImageFileRoot.failure'),
                  description: t('ImageFileRoot.uploadFailure', { entityName: file.name })
                });
                logger.error(`Could not upload image due to the following error: ${error}`);
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
      <div className="right-container">
        {
          !_isNil(imageFileId) && (<ImageFileForm />)
        }
      </div>
    </div>
  );
};

export default ImageFileRoot;
