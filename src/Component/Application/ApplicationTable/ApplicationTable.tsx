import React, { useState } from 'react';

import Application from '../../../Model/Application';

import Table, { TableProps } from 'antd/lib/table';
import TableUtil from '../../../Util/TableUtil';
import { Form, Modal, Input, notification, Tooltip } from 'antd';

import {
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
  const match = matchPath<{ applicationId: string }>(location.pathname, {
    path: '/portal/application/:applicationId'
  });
  const applicationId = match?.params?.applicationId;

  const [applications, setApplications] = useState<Application[]>();
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
      ...TableUtil.getColumnSearchProps('name', handleSearch, handleReset)
    }
  ];

  if (!disableActions) {
    columns.push({
      title: '',
      className: 'operation-column',
      width: 100,
      dataIndex: 'operation',
      render: (_: any, record: Application) => {
        return (
          <div className="actions">
            <Tooltip title="Löschen">
              <DeleteOutlined onClick={() => onDeleteClick(record)} />
            </Tooltip>
          </div>
        );
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
          selectedRowKeys: applicationId ? [applicationId.toString()] : []
        }}
        rowKey={(record) => record.id.toString()}
        dataSource={applications}
        pagination={false}
        onRow={(record: Application, rowIndex: number) => {
          return {
            onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => onRowClick(record, event)
          };
        }}
        columns={columns}
        {...passThroughProps}
      />
    </Form>
  );
};

export default ApplicationTable;
