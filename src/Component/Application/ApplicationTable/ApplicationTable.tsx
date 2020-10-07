import React, { useState } from 'react';

import Application from '../../../Model/Application';
import { EditableCell } from '../../Table/EditableCell';

import Table, { TableProps } from 'antd/lib/table';
import TableUtil from '../../../Util/TableUtil';
import { Form, Modal, Input, notification, Tooltip } from 'antd';

import {
  CheckCircleTwoTone,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import './ApplicationTable.less';
import ApplicationService from '../../../Service/ApplicationService/ApplicationService';
import { matchPath, useHistory, useLocation } from 'react-router-dom';

type OwnProps = {
  disableActions?: boolean;
};

type ApplicationTableProps = OwnProps & TableProps<Application>;

const applicationService = new ApplicationService();

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  disableActions = false,
  ...passThroughProps
}) => {

  const history = useHistory();
  const location = useLocation();
  const match = matchPath<{applicationId: string}>(location.pathname, {
    path: '/portal/application/:applicationId'
  });
  const applicationId = match?.params?.applicationId;

  const [applications, setApplications] = useState<Application[]>();
  const [editingName, setEditingName] = useState('');
  const [loadingState, setLoadingState] = useState<'failed' | 'loading' | 'done'>();
  const [form] = Form.useForm();

  const fetchApplications = async () => {
    setLoadingState('loading');
    try {
      const apps = await applicationService.findAll();
      setApplications(apps);
      setLoadingState('done');
    } catch (error) {
      setLoadingState('failed');
    }
  };

  if (!loadingState) {
    fetchApplications();
  }

  const isEditing = (record: Application) => record.name === editingName;

  const edit = (record: Application) => {
    form.setFieldsValue({
      ...record
    });
    setEditingName(record.name);
  };

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  const handleReset = clearFilters => {
    clearFilters();
  };

  const onDeleteClick = (record) => {
    if (!record.id) {
      setApplications(applications.filter(r => r !== record));
      return;
    }

    let confirmName;
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
        if (confirmName === record.name) {
          applicationService
            .delete(record.id)
            .then(() => {
              notification.info({
                message: 'Applikation gelöscht',
                description: `Applikation "${record.name}" wurde gelöscht`
              });
              fetchApplications();
            });
        }
      }
    });
  };

  const save = async (name: string) => {
    const row = (await form.validateFields()) as Application;
    const affectedApplication = applications.find(t => t.name === editingName);
    const updatedApplication = {
      ...affectedApplication,
      ...row
    };

    if (affectedApplication.id) {
      applicationService
        .update(updatedApplication)
        .then(fetchApplications)
        .then(stopEditing);
    } else {
      applicationService
        .add(updatedApplication)
        .then(fetchApplications)
        .then(stopEditing);
    }
  };

  const stopEditing = () => {
    setEditingName('');
  };

  const getSorter = (index: string) => {
    return (a, b) => {
      a = typeof a[index] === 'string' ? a[index]?.toLowerCase() : a[index]?.toString();
      b = typeof b[index] === 'string' ? b[index]?.toLowerCase() : b[index]?.toString();
      return a?.localeCompare(b) || 0;
    };
  };

  const columns: any[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: getSorter('name'),
      defaultSortOrder: 'ascend',
      editable: true,
      ...TableUtil.getColumnSearchProps('name', handleSearch, handleReset)
    }
  ];

  if(!disableActions) {
    columns.push({
      title: '',
      className: 'operation-column',
      width: 100,
      dataIndex: 'operation',
      render: (_: any, record: Application) => {
        if (isEditing(record)) {
          return (
            <div className="actions">
              <Tooltip title="Speichern">
                <CheckCircleTwoTone
                  twoToneColor="#52c41a"
                  onClick={() => save(record.name)}
                  style={{ marginRight: 8 }}
                />
              </Tooltip>
              <Tooltip title="Abbrechen">
                <CloseCircleOutlined onClick={stopEditing} />
              </Tooltip>
            </div>
          );
        } else {
          return (
            <div className="actions">
              <Tooltip title="Bearbeiten">
                <EditOutlined onClick={() => edit(record)} />
              </Tooltip>
              <Tooltip title="Löschen">
                <DeleteOutlined onClick={() => onDeleteClick(record)} />
              </Tooltip>
            </div>
          );
        }
      }
    });
  }

  const onRowClick = (record: Application, event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    history.push(`/portal/application/${record.id}`);
  };

  return (
    <Form form={form} component={false}>
      <Table
        className="application-table"
        rowSelection={{
          type: 'radio',
          columnWidth: 0,
          renderCell: () => '',
          selectedRowKeys: [applicationId.toString()]
        }}
        rowKey={(record)=> record.id.toString()}
        rowClassName={() => 'editable-row'}
        dataSource={applications}
        pagination={false}
        components={{
          body: {
            cell: EditableCell
          }
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => onRowClick(record, event)
          };
        }}
        columns={
          columns.map(col => {
            if (!col.editable) {
              return col;
            }
            return {
              ...col,
              onCell: record => ({
                record,
                dataType: col.dataIndex === 'isIndividual' ? 'boolean' :
                  col.dataIndex === 'transportationTraits' ? 'transportationTraits'
                    : 'text',
                editing: isEditing(record),
                dataIndex: col.dataIndex,
                title: col.title
              })
            };
          })
        }
        {...passThroughProps}
      />
    </Form>
  );
};

export default ApplicationTable;
