import './ImageFileForm.less';

import React, { useCallback, useEffect, useState } from 'react';

import { PageHeader } from '@ant-design/pro-components';
import { Form, Spin, Switch } from 'antd';
import { SwitchChangeEventHandler } from 'antd/lib/switch';
import _isNil from 'lodash/isNil';
import { useTranslation } from 'react-i18next';
import {
  matchPath,
  useLocation
} from 'react-router-dom';
import config from 'shogunApplicationConfig';

import ImageFile from '@terrestris/shogun-util/dist/model/ImageFile';
import { getBearerTokenHeader } from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';

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
    const response = await fetch(`/imagefiles/${imageFileId}/permissions/public`, {
      method: checked ? 'POST' : 'DELETE',
      headers: {
        ...getBearerTokenHeader(client.getKeycloak())
      }
    });
    if (response.ok) {
      setPublic(checked);
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
      const response = await fetch(`/imagefiles/${imageFileId}/permissions/public`, {
        headers: {
          ...getBearerTokenHeader(client.getKeycloak())
        }
      });
      const data = await response.json();
      setPublic(data.public);
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
                ? <a target="_blank" href={`/imagefiles/${file?.fileUuid}`}>{file?.fileUuid}</a>
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
