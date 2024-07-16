import React from 'react';

import {
  render
} from '@testing-library/react';

import { FormInstance } from 'antd';

import { EntityType } from '../InstancePermissionGrid/InstancePermissionGrid';

import GroupPermissionGrid from './GroupPermissionGrid';

let mockEntityType: EntityType;
let mockForm: FormInstance<any>;

describe('<GroupPermissionGrid />', () => {
  beforeEach(() => {
    mockForm = {
      submit: jest.fn(),
      getFieldValue: jest.fn(),
      getFieldsValue: jest.fn(() => true),
      resetFields: jest.fn(),
      setFieldsValue: jest.fn(),
      validateFields: jest.fn(),
      scrollToField: jest.fn(),
      getFieldError: jest.fn(),
      getFieldsError: jest.fn(),
      getFieldWarning: jest.fn(),
      getFieldInstance: jest.fn(),
      isFieldsTouched: jest.fn(),
      isFieldTouched: jest.fn(),
      isFieldValidating: jest.fn(),
      isFieldsValidating: jest.fn(),
      setFields: jest.fn(),
      setFieldValue: jest.fn()
    };
  });

  it('is defined', () => {
    expect(GroupPermissionGrid).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    mockEntityType = 'group' as EntityType;

    const {
      container
    } = render(
      <GroupPermissionGrid
        entityId={mockForm.getFieldValue('id')}
        entityType={mockEntityType.toLowerCase()}
      />);
    expect(container).toBeVisible();

    expect(container.querySelector('.instance-permission-grid')).toBeVisible();
    expect(container.querySelector('.ant-spin-container')).toBeVisible();
    expect(container.innerHTML).toContain('InstancePermissionGrid.nameColumnTitle');
    expect(container.innerHTML).toContain('InstancePermissionGrid.permissionColumnTitle');
    const tableElement = container.querySelector('.ant-table-tbody');
    expect(tableElement?.querySelector('.ant-table-cell')).toHaveAttribute('colspan', '3');
    expect(tableElement?.querySelector('.ant-empty-image')).toBeVisible();
    expect(container.querySelector('.ant-empty-description')?.innerHTML).toBe('No data');
  });
});
