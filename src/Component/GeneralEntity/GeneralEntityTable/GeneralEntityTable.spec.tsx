import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  RenderOptions,
  screen
} from '@testing-library/react';

import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';

import {
  ControllerUtil
} from '../../../Controller/ControllerUtil';

import i18n from '../../../i18n';

import { EntityType } from '../../FormField/Permission/InstancePermissionGrid/InstancePermissionGrid';

import {
  GeneralEntityTable,
  GeneralEntityTableColumn,
  TableConfig
} from './GeneralEntityTable';
import GeneralEntityRootContext, { ContextValue } from '../../../Context/GeneralEntityRootContext';

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

const renderInContext = <T extends BaseEntity,>(ui: React.ReactNode, providerProps?: ContextValue<T>,
  renderOptions?: Omit<RenderOptions, 'queries'> | undefined) => {
  return render(
    <GeneralEntityRootContext.Provider
      value={providerProps}
    >
      {ui}
    </GeneralEntityRootContext.Provider>,
    renderOptions
  )
};

describe('<GeneralEntityTable />', () => {
  let mockController;
  let mockEntityType: EntityType;
  let mockTableConfig: TableConfig<BaseEntity>;
  let mockBaseEntities: BaseEntity[];

  beforeEach(() => {
    mockController = {
      someMethod: jest.fn(),
    };
    jest.spyOn(ControllerUtil, 'createController').mockImplementation(() => mockController);

    const mockGeneralEntityTableColumn: GeneralEntityTableColumn<BaseEntity> = {
      title: 'ID',
      sorter: true,
      sortOrder: 'ascend',
      filters: [
        {
          text: 'Filter 1',
          value: 'filter1'
        },
        {
          text: 'Filter 2',
          value: 'filter2'
        }
      ],
      onFilter: (value, record) => record.id === value,
      filtered: true,
      filterDropdownOpen: true,
      filterIcon: (filtered) => (filtered ? <span>🔍</span> : <span>🔎</span>),
      responsive: ['lg', 'md', 'sm'],
    };

    mockTableConfig = {
      columnDefinition: [mockGeneralEntityTableColumn],
      dataMapping: {
        column1: {
          title: 'Column 1',
          dataIndex: 'column1',
          key: 'key1'
        },
        column2: {
          title: 'Column 2',
          dataIndex: 'column2',
          key: 'key2'
        },
      },
    };

    mockBaseEntities = [new BaseEntity({
      id: undefined,
      created: new Date('2023-07-01T00:00:00Z'),
      modified: new Date('2024-07-31T00:00:00Z')
    }),
    new BaseEntity({
      id: 1,
      created: new Date('2023-07-01T00:00:00Z'),
      modified: new Date('2024-07-31T00:00:00Z')
    })];
  });

  afterEach(() => {
    cleanup();
  });

  it('can be rendered', async () => {
    mockEntityType = 'group';

    const {
      container
    } = renderInContext(
      <GeneralEntityTable
        actions={['delete', 'edit']}
        controller={mockController}
        i18n={i18n}
        tableConfig={{}}
      />,
      {
        entityType: mockEntityType,
        entities: []
      }
    );
    expect(container).toBeVisible();
    expect(container.querySelector('.general-entity-table')).toBeVisible();
    expect(screen.getByText('Table.emptyText')).toBeVisible();
    expect(screen.getByText('GeneralEntityTable.columnId')).toBeVisible();
    expect(screen.getByText('GeneralEntityTable.columnName')).toBeVisible();
  });

  it('navigates on click', async () => {
    mockEntityType = 'layer';

    const {
      container
    } = renderInContext(
      <GeneralEntityTable
        actions={['delete', 'edit']}
        controller={mockController}
        i18n={i18n}
        tableConfig={mockTableConfig}
      />,
      {
        entityType: mockEntityType,
        entities: mockBaseEntities
      }
    );
    expect(container).toBeVisible();
    expect(screen.getByText('1')).toBeVisible();
    expect(container.querySelector('.ant-pagination-disabled')).toBeVisible();

    const rowElement: HTMLElement | null = container.querySelector('tr[data-row-key="1"]');
    expect(rowElement).toBeVisible();

    await fireEvent.click(rowElement!);
    expect(mockUsedNavigate).toHaveBeenCalled();
  });

  it('fetches entity if ID is not defined', async () => {
    mockEntityType = 'layer';
    const mockFetchEntities = jest.fn();

    const {
      container
    } = renderInContext(
      <GeneralEntityTable
        actions={['delete', 'edit']}
        controller={mockController}
        i18n={i18n}
        tableConfig={mockTableConfig}
      />,
      {
        entityType: mockEntityType,
        entities: mockBaseEntities,
        fetchEntities: mockFetchEntities
      }
    );
    expect(container).toBeVisible();

    const deleteElement: HTMLElement | null = container.querySelector('span[aria-label="delete"]');
    expect(deleteElement).toBeVisible();

    await fireEvent.click(deleteElement!);

    expect(mockUsedNavigate).toHaveBeenCalled();
    expect(mockFetchEntities).toHaveBeenCalled();
  });
});

