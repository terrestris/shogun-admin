import React from 'react';

import {
  render
} from '@testing-library/react';

import { EntityType } from '../InstancePermissionGrid/InstancePermissionGrid';

import GroupPermissionGrid from './GroupPermissionGrid';

let mockEntityType: EntityType;

describe('<GroupPermissionGrid />', () => {

  it('is defined', () => {
    expect(GroupPermissionGrid).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    mockEntityType = 'group' as EntityType;

    const {
      container
    } = render(
      <GroupPermissionGrid
        entityId={1909}
        entityType={mockEntityType}
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
