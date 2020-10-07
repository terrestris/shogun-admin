import React, { useEffect, useState } from 'react';

import Application from '../../../Model/Application';

import { Button, Form, Input } from 'antd';


import './ApplicationEditForm.less';
import ApplicationService from '../../../Service/ApplicationService/ApplicationService';
import Logger from 'js-logger';

type OwnProps = {
  id?: number | string;
};

type ApplicationEditFormProps = OwnProps;

const applicationService = new ApplicationService();

export const ApplicationEditForm: React.FC<ApplicationEditFormProps> = ({
  id
}) => {

  const [application, setApplication] = useState<Application>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id && id.toString() !== 'create') {
      fetchApplication(id);
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

  // const onDeleteClick = (record) => {
  //   if (!record.id) {
  //     setApplications(applications.filter(r => r !== record));
  //     return;
  //   }

  //   let confirmName;
  //   Modal.confirm({
  //     cancelText: 'Abbrechen',
  //     title: 'Applikation löschen',
  //     content: (
  //       <div>
  //         <div>Die Applikation wird gelöscht!</div>
  //         <br />
  //         <div>Bitte geben sie zum Bestätigen den Namen ein:</div>
  //         <Input onChange={(e) => { confirmName = e.target.value; }} />
  //       </div>
  //     ),
  //     onOk: () => {
  //       if (confirmName === record.name) {
  //         applicationService
  //           .delete(record.id)
  //           .then(() => {
  //             notification.info({
  //               message: 'Applikation gelöscht',
  //               description: `Applikation "${record.name}" wurde gelöscht`
  //             });
  //             fetchApplications();
  //           });
  //       }
  //     }
  //   });
  // };

  const saveApp = async () => {
    const updates = (await form.validateFields()) as Application;
    const updatedApplication = {
      ...application,
      ...updates
    };

    if (application.id && application.id.toString() !== 'create') {
      applicationService
        .update(updatedApplication)
        // .then(fetchApplications)
    } else {
      applicationService
        .add(updatedApplication)
        // .then(fetchApplications)
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
          Save
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
