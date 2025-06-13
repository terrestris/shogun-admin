import './ImageFileForm.less';

import React, { useCallback, useEffect, useState } from 'react';

import { PageHeader } from '@ant-design/pro-components';
import { Form, Spin, Switch } from 'antd';
import { SwitchChangeEventHandler } from 'antd/lib/switch';
import Logger from 'js-logger';
import _isNil from 'lodash/isNil';
import { useTranslation } from 'react-i18next';
import {
  matchPath,
  useLocation
} from 'react-router-dom';
import config from 'shogunApplicationConfig';

import ImageFile from '@terrestris/shogun-util/dist/model/ImageFile';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';

interface OwnProps { }

type ImageFileRootProps = OwnProps;

export const ImageFileForm: React.FC<ImageFileRootProps> = () => {

  const [fileBlob, setFileBlob] = useState<Blob>();
  const [file, setFile] = useState<ImageFile>();
  const [isPublic, setPublic] = useState<boolean>(false);

  const location = useLocation();
  const client = useSHOGunAPIClient();
  const match = matchPath({
    path: `${config.appPrefix}/portal/imagefile/:id`
  }, location.pathname);
  const imageFileId = match?.params?.id;

  const {
    t
  } = useTranslation();

  const onPublicChange: SwitchChangeEventHandler = useCallback(async (checked) => {
    if (!client || _isNil(imageFileId)) {
      setFileBlob(undefined);
      return;
    }

    try {
      if (checked) {
        await client.imagefile().setPublic(parseInt(imageFileId, 10));
      } else {
        await client.imagefile().revokePublic(parseInt(imageFileId, 10));
      }

      setPublic(checked);
    } catch (error) {
      Logger.error('Error while changing public state of an image file', error);
    }
  }, [imageFileId, client]);

  useEffect(() => {
    if (!file) {
      return;
    }

    const fetchImageBlob = async () => {
      if (!client || _isNil(file.fileUuid)) {
        return;
      }
      const response = await client.imagefile().findOne(file.fileUuid);
      setFileBlob(response);
    };

    fetchImageBlob();
  }, [file, client]);

  useEffect(() => {
    if (!client || _isNil(imageFileId)) {
      setFileBlob(undefined);
      return;
    }

    const fetchImageData = async () => {
      const result = await client.graphql().sendQuery<ImageFile>({
        query: `query($id: Int) {
          imageFileById(id: $id) {
            active
            fileType
            id
            created
            modified
            fileUuid
            fileName
            width
            height
          }
        }`,
        variables: {
          id: parseInt(imageFileId, 10)
        }
      });
      setFile(result.imageFileById);
    };

    const fetchPublicState = async () => {
      setPublic(await client.imagefile().isPublic(parseInt(imageFileId, 10)));
    };

    fetchImageData();
    fetchPublicState();
  }, [imageFileId, client]);

  return (
    <>
      <PageHeader
        title={t('ImageFileForm.title')}
      />
      <Spin
        spinning={false}
      >
        <Form
          className="image-file-form"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label={t('ImageFileForm.name')}
          >
            {file?.fileName}
          </Form.Item>
          <Form.Item
            label={t('ImageFileForm.uuid')}
          >
            {
              isPublic
                ? <a target="_blank" href={`${client?.getBasePath()}imagefiles/${file?.fileUuid}`}>{file?.fileUuid}</a>
                : file?.fileUuid
            }
          </Form.Item>
          <Form.Item
            label={t('ImageFileForm.public')}
          >
            <Switch
              key="public"
              checked={isPublic}
              onChange={onPublicChange}
            />
          </Form.Item>
          <Form.Item
            label={t('ImageFileForm.preview')}
          >
            {
              fileBlob &&
              <div className="image-preview">
                <img src={URL.createObjectURL(fileBlob)} alt="preview" />
              </div>
            }
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default ImageFileForm;
