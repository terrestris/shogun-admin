import React, { useEffect, useState } from 'react';

import { Button, Form, Input, Modal, notification } from 'antd';


import './ImageFileEditForm.less';
import ImageFileService from '../../../Service/ImageFileService/ImageFileService';
import Logger from 'js-logger';

import { useHistory } from 'react-router-dom';
import ImageFile from '../../../Model/ImageFile';

type OwnProps = {
  id?: number | 'create';
};

type ImageFileEditFormProps = OwnProps;

const imageFileService = new ImageFileService();

export const ImageFileEditForm: React.FC<ImageFileEditFormProps> = ({
  id
}) => {

  const history = useHistory();

  const [imageFile, setImageFile] = useState<ImageFile>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id && id.toString() !== 'create') {
      fetchImageFile(parseInt(id.toString(), 10));
    }
  }, [id]);

  const fetchImageFile = async (fileId: number) => {
    try {
      const imgFile = await imageFileService.findOne(fileId);
      setImageFile(imgFile);
      form.setFieldsValue({
        ...imgFile
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  const deleteImageFile = () => {

    let confirmName;
    const imageFileName = form.getFieldValue('name');
    // TODO move to own component
    Modal.confirm({
      cancelText: 'Abbrechen',
      title: 'Bilddatei löschen',
      content: (
        <div>
          <div>Die Bilddatei wird gelöscht!</div>
          <br />
          <div>Bitte geben sie zum Bestätigen den Namen ein:</div>
          <Input onChange={(e) => { confirmName = e.target.value; }} />
        </div>
      ),
      onOk: () => {
        try {
          if (confirmName === imageFileName) {
            imageFileService
              .delete(imageFile.id)
              .then(() => {
                notification.success({
                  message: 'Bilddatei gelöscht',
                  description: `Bilddatei "${imageFileName}" wurde gelöscht`
                });
                history.push('/portal/imagefile');
              });
          }
        } catch (error) {
          notification.error({
            message: `Bilddatei "${imageFileName}" konnte nicht gelöscht werden`
          });
          Logger.error(error);
        }
      }
    });
  };

  const saveImageFile = async () => {
    const updates = (await form.validateFields()) as ImageFile;
    const updatedImageFile = {
      ...imageFile,
      ...updates
    };

    const updateMode = id.toString() !== 'create';
    const name = updatedImageFile.fileName;
    try {
      if (updateMode) {
        imageFileService.update(updatedImageFile);
      } else {
        imageFileService.add(updatedImageFile);
      }
      notification.success({
        message: `Bilddatei "${name}" wurde erfolgreich ${updateMode ? 'aktualisiert' : 'erstellt'}`
      });
    } catch (error) {
      notification.error({
        message: `Bilddatei "${name}" konnte nicht ${updateMode ? 'aktualisiert' : 'erstellt'} werden`
      });
      Logger.error(error);
    }
  };

  return (
    <div
      className="imagefile-form"
    >
      <Form
        form={form}
        component={false}
        layout="vertical"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          name="filename"
          label="Dateiname"
          rules={[{
            required: true,
            message: 'Bitte geben Sie einen Dateiname ein!'
          }]}
        >
          <Input
            placeholder="Name"
          />
        </Form.Item>
        <Form.Item
          className="form-buttons"
          wrapperCol={{
            offset: 4,
            span: 20
          }}
        >
          <Button type="primary" onClick={saveImageFile}>
            Speichern
          </Button>
          <Button type="primary" danger onClick={deleteImageFile}>
            Löschen
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ImageFileEditForm;
