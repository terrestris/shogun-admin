import React, {
  useEffect,
  useState
} from 'react';

import { useHistory } from 'react-router-dom';

import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  notification
} from 'antd';

import Logger from 'js-logger';

import JSONEditor from '../../FormField/JSONEditor/JSONEditor';
import DisplayField from '../../FormField/DisplayField/DisplayField';

import ApplicationService from '../../../Service/ApplicationService/ApplicationService';

import Application from '../../../Model/Application';

import config from 'shogunApplicationConfig';

import './ApplicationEditForm.less';

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
    } else if (id && id.toString() === 'create' && application) {
      application.id = null;
      application.created = null;
      application.modified = null;
    }
  }, [id]);

  const fetchApplication = async (appId: number) => {
    try {
      const app = await applicationService.findOne(appId);
      setApplication(app);
      form.resetFields();
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
                history.push(`${config.appPrefix}/portal/application`);
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
        applicationService.update(updatedApplication);
      } else {
        applicationService.add(updatedApplication);
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
    <div
      className="application-form"
    >
      <Form
        form={form}
        component={false}
        layout="vertical"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
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
          <DisplayField
            formatter={(date) => {
              return date && new Intl.DateTimeFormat('de-DE').format(new Date(date));
            }}
          />
        </Form.Item>
        <Form.Item
          name="modified"
          label="Editiert am"
        >
          <DisplayField
            formatter={(date) => {
              return date && new Intl.DateTimeFormat('de-DE').format(new Date(date));
            }}
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
          <JSONEditor />
        </Form.Item>
        <Form.Item
          name="layerTree"
          label="Themen-Baum"
        >
          <JSONEditor />
        </Form.Item>
        <Form.Item
          name="layerConfig"
          label="Themen-Konfiguration"
        >
          <JSONEditor />
        </Form.Item>
        <Form.Item
          className="form-buttons"
          wrapperCol={{
            offset: 4,
            span: 20
          }}
        >
          <Button
            type="primary"
            onClick={saveApp}
          >
            Speichern
          </Button>
          <Button
            type="primary"
            danger
            onClick={deleteApp}
          >
            Löschen
          </Button>
          <Button
            onClick={() => form.resetFields()}
          >
            Formularfelder leeren
          </Button>
          <Button
            onClick={() => form.setFieldsValue({ ...application })}
          >
            Änderungen zurücksetzen
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ApplicationEditForm;
