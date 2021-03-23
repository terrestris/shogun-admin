import React, {
  useEffect,
  useState
} from 'react';

import { useHistory } from 'react-router-dom';

import {
  Button,
  Form,
  Input,
  Modal,
  notification
} from 'antd';

import Logger from 'js-logger';

import JSONEditor from '../../FormField/JSONEditor/JSONEditor';
import DisplayField from '../../FormField/DisplayField/DisplayField';

import LayerTypeSelect from '../LayerTypeSelect/LayerTypeSelect';

import LayerService from '../../../Service/LayerService/LayerService';

import Layer from '../../../Model/Layer';

import config from 'shogunApplicationConfig';

import './LayerEditForm.less';

type OwnProps = {
  id?: number | 'create';
};

type LayerEditFormProps = OwnProps;

const layerService = new LayerService();

export const LayerEditForm: React.FC<LayerEditFormProps> = ({
  id
}) => {

  const history = useHistory();

  const [layer, setLayer] = useState<Layer>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id && id.toString() !== 'create') {
      fetchLayer(parseInt(id.toString(), 10));
    } else if (id && id.toString() === 'create' && layer) {
      layer.id = null;
      layer.created = null;
      layer.modified = null;
    }
  }, [id]);

  const fetchLayer = async (layerId: number) => {
    try {
      const lyr = await layerService.findOne(layerId);
      setLayer(lyr);
      if (lyr.clientConfig) {
        lyr.clientConfig = JSON.stringify(lyr.clientConfig);
      }
      if (lyr.sourceConfig) {
        lyr.sourceConfig = JSON.stringify(lyr.sourceConfig);
      }
      if (lyr.features) {
        lyr.features = JSON.stringify(lyr.features);
      }
      form.setFieldsValue({
        ...lyr
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  const deleteLayer = () => {
    let confirmName;
    const layerName = form.getFieldValue('name');
    // TODO move to own component
    Modal.confirm({
      cancelText: 'Abbrechen',
      title: 'Layer löschen',
      content: (
        <div>
          <div>Der Layer wird gelöscht!</div>
          <br />
          <div>Bitte geben sie zum Bestätigen den Namen ein:</div>
          <Input onChange={(e) => { confirmName = e.target.value; }} />
        </div>
      ),
      onOk: () => {
        try {
          if (confirmName === layerName) {
            layerService
              .delete(layer.id)
              .then(() => {
                notification.success({
                  message: 'Layer gelöscht',
                  description: `Layer "${layerName}" wurde gelöscht`
                });
                history.push(`${config.appPrefix}/portal/layer`);
              });
          }
        } catch (error) {
          notification.error({
            message: `Layer "${layerName}" konnte nicht gelöscht werden`
          });
          Logger.error(error);
        }
      }
    });
  };

  const saveLayer = async () => {
    const updates = (await form.validateFields()) as Layer;
    const updatedLayer = {
      ...layer,
      ...updates
    };

    const updateMode = id.toString() !== 'create';
    const name = updatedLayer.name;

    if (updatedLayer.clientConfig) {
      updatedLayer.clientConfig = JSON.parse(updatedLayer.clientConfig);
    }
    if (updatedLayer.sourceConfig) {
      updatedLayer.sourceConfig = JSON.parse(updatedLayer.sourceConfig);
    }
    if (updatedLayer.features) {
      updatedLayer.features = JSON.parse(updatedLayer.features);
    }

    try {
      if (updateMode) {
        layerService.update(updatedLayer);
      } else {
        layerService.add(updatedLayer);
      }
      notification.success({
        message: `Layer "${name}" wurde erfolgreich ${updateMode ? 'aktualisiert' : 'erstellt'}`
      });
    } catch (error) {
      notification.error({
        message: `Layer "${name}" konnte nicht ${updateMode ? 'aktualisiert' : 'erstellt'} werden`
      });
      Logger.error(error);
    }
  };

  return (
    <div
      className="layer-form"
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
          name="type"
          label="Typ"
        >
          <LayerTypeSelect />
        </Form.Item>
        <Form.Item
          name="clientConfig"
          label="Konfiguration"
        >
          <JSONEditor />
        </Form.Item>
        <Form.Item
          name="sourceConfig"
          label="Datenquelle"
        >
          <JSONEditor />
        </Form.Item>
        <Form.Item
          name="features"
          label="Features"
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
            onClick={saveLayer}
          >
            Speichern
          </Button>
          <Button
            type="primary"
            danger
            onClick={deleteLayer}
          >
            Löschen
          </Button>
          <Button
            onClick={() => form.resetFields()}
          >
            Formularfelder leeren
          </Button>
          <Button
            onClick={() => form.setFieldsValue({ ...layer })}
          >
            Änderungen zurücksetzen
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LayerEditForm;
