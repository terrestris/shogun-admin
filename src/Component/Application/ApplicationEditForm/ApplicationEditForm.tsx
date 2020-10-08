import React, { useEffect, useState } from 'react';

import Application from '../../../Model/Application';

import { Button, Form, Input, Modal, notification } from 'antd';


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
                notification.info({
                  message: 'Applikation gelöscht',
                  description: `Applikation "${appName}" wurde gelöscht`
                });
                history.push('/portal/application');
              });
          }
        } catch (error) {
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

    try {
      if (id?.toString() !== 'create') {
        applicationService
          .update(updatedApplication)
          .then(() => {
            history.push('/portal/application');
          });
      } else {
        applicationService
          .add(updatedApplication);
      }
      history.push('/portal/application');
    } catch (error) {
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
          message: 'Please set an application name!'
        }]}
      >
        <Input
          placeholder="Name"
        />
      </Form.Item>
      <Form.Item
        name="created"
        label="Created at"
      >
        <Input
          bordered={false}
        />
      </Form.Item>
      <Form.Item
        name="modified"
        label="Modified at"
      >
        <Input
          bordered={false}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={saveApp}>
          Speichern
        </Button>
        <Button type="primary" danger onClick={deleteApp}>
          Löschen
        </Button>
        <Button onClick={() => form.resetFields()}>
          Clear form
        </Button>
        <Button onClick={() => form.setFieldsValue({...application})}>
          Reset changes
        </Button>
      </Form.Item>
      {/* {`hallo ${application ? application.name : 'welt'}`} */}
    </Form>
  );
};

export default ApplicationEditForm;
