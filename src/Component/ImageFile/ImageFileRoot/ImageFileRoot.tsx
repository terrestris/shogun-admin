import { Button, notification, PageHeader, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  useNavigate,
  useLocation,
  matchPath
} from 'react-router-dom';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import ImageFileTable from '../ImageFileTable/ImageFileTable';

import { GraphQLService } from '../../../Service/GraphQLService/GraphQLService';

import config from 'shogunApplicationConfig';

import './ImageFileRoot.less';
import { useTranslation } from 'react-i18next';
import Logger from '@terrestris/base-util/dist/Logger';

interface OwnProps { }

type ImageFileRootProps = OwnProps;

type LoadingState = 'idle' | 'loading' | 'finished' | 'failed';

export const ImageFileRoot: React.FC<ImageFileRootProps> = props => {

  const [fileBlob, setFileBlob] = useState<Blob>();
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');

  const graphQLService = new GraphQLService({
    url: '../graphql'
  });

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

  const applicationStartsWith = `query($id: Long) {
    applicationIdStartsWith(id: $id)
  }`;

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

  const fetchEntityIds = async (search) => {
    setLoadingState('loading');
    const id = parseInt(search, 10);
    let dataKey = 'applicationIdStartsWith';
    try {
      const data = await graphQLService.sendQuery(applicationStartsWith, { id });
      setLoadingState('idle');
      return data[dataKey];
    } catch (error) {
      Logger.error(error);
      setLoadingState('failed');
    }
  };

  return (
    <div className="imagefile-root">
      <PageHeader
        className="header"
        onBack={() => navigate(-1)}
        title={t('ImageFileRoot.title')}
        subTitle={t('ImageFileRoot.subTitle')}
      >
      </PageHeader>
      <Button
        onClick={async () => {
          await fetchEntityIds('1');
        }}
        loading={loadingState === 'loading'}
      >
        Id search test
      </Button>
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
                  message: t('ImageFileRoot.success'),
                  description: t('ImageFileRoot.uploadSuccess', { entityName: file.name })
                });

                navigate(`${config.appPrefix}/portal/imagefile/${uploadedFile.fileUuid}`);
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
