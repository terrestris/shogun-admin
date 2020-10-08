import React, { useEffect, useState } from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

import Application from '../../../Model/Application';

import { Button, Checkbox, Form, Input, Modal, notification } from 'antd';


import './ApplicationEditForm.less';
import ApplicationService from '../../../Service/ApplicationService/ApplicationService';
import Logger from 'js-logger';

import { useHistory } from 'react-router-dom';

type OwnProps = {
  id?: number | 'create';
};

type ApplicationEditFormProps = OwnProps;

const applicationService = new ApplicationService();

export const ApplicationEditForm: React.FC<ApplicationEditFormProps> = ({
  id
}) => {

  const history = useHistory();

  const [application, setApplication] = useState<Application>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id && id.toString() !== 'create') {
      fetchApplication(parseInt(id.toString(), 10));
    }
  }, [id]);

  const fetchApplication = async (appId: number) => {
    try {
      const app = await applicationService.findOne(appId);
      setApplication(app);
      form.setFieldsValue({
        ...app
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  const deleteApp = () => {

    let confirmName;
    const appName = form.getFieldValue('name');
    // TODO move to own component
    Modal.confirm({
      cancelText: 'Abbrechen',
      title: 'Applikation löschen',
      content: (
        <div>
          <div>Die Applikation wird gelöscht!</div>
          <br />
          <div>Bitte geben sie zum Bestätigen den Namen ein:</div>
          <Input onChange={(e) => { confirmName = e.target.value; }} />
        </div>
      ),
      onOk: () => {
        try {
          if (confirmName === appName) {
            applicationService
              .delete(application.id)
              .then(() => {
                notification.success({
                  message: 'Applikation gelöscht',
                  description: `Applikation "${appName}" wurde gelöscht`
                });
                history.push('/portal/application');
              });
          }
        } catch (error) {
          notification.error({
            message: `Applikation "${appName}" konnte nicht gelöscht werden`
          });
          Logger.error(error);
        }
      }
    });
  };

  const saveApp = async () => {
    const updates = (await form.validateFields()) as Application;
    const updatedApplication = {
      ...application,
      ...updates
    };

    const updateMode = id.toString() !== 'create';
    const name = updatedApplication.name;
    try {
      if (updateMode) {
        applicationService
          .update(updatedApplication)
          .then(() => {
            history.push('/portal/application');
          });
      } else {
        applicationService.add(updatedApplication)
          .then(() => {
            history.push('/portal/application');
          });;
      }
      notification.success({
        message: `Applikation "${name}" wurde erfolgreich ${updateMode ? 'aktualisiert' : 'erstellt'}`
      });
    } catch (error) {
      notification.error({
        message: `Applikation "${name}" konnte nicht ${updateMode ? 'aktualisiert' : 'erstellt'} werden`
      });
      Logger.error(error);
    }
  };

  return (
    <Form
      form={form}
      component={false}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{
          required: true,
          message: 'Bitte geben Sie einen Namen ein!'
        }]}
      >
        <Input
          placeholder="Name"
        />
      </Form.Item>
      <Form.Item
        name="created"
        label="Erstellt am"
      >
        <Input
          readOnly={true}
          bordered={false}
        />
      </Form.Item>
      <Form.Item
        name="modified"
        label="Editiert am"
      >
        <Input
          readOnly={true}
          bordered={false}
        />
      </Form.Item>
      <Form.Item
        name="stateOnly"
        label="Arbeitstand"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        name="clientConfig"
        label="Konfiguration"
      >
        // TODO get me work
        <Editor />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={saveApp}>
          Speichern
        </Button>
        <Button type="primary" danger onClick={deleteApp}>
          Löschen
        </Button>
        <Button onClick={() => form.resetFields()}>
          Formularfelder leeren
        </Button>
        <Button onClick={() => form.setFieldsValue({ ...application })}>
          Änderungen zurücksetzen
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ApplicationEditForm;
