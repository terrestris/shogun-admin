import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { Modal, notification } from 'antd';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import ImageFileTable from './ImageFileTable';

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

jest.mock('shogunApplicationConfig', () => ({
  defaultPageSize: 10,
  appPrefix: '/app'
}));

const mockService = {
  findAll: jest.fn(),
  delete: jest.fn()
};

const mockSHOGunAPIClient = {
  imagefile: jest.fn().mockReturnValue(mockService),
};

jest.mock('../../../Hooks/useSHOGunAPIClient', () => {
  const originalModule = jest.requireActual('../../../Hooks/useSHOGunAPIClient');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => mockSHOGunAPIClient)
  };
});

const mockData = {
  totalElements: 1,
  content: [
    {
      id: 1,
      fileUuid: '123e4567-e89b-12d3-a456-426614174000',
      fileName: 'example.png',
      created: '2024-07-31T12:00:00Z'
    }
  ]
};

describe('<ImageFileTable />', () => {
  let modalConfirmSpy: any;
  let notificationInfoSpy: any;

  beforeEach(() => {
    mockService.findAll.mockResolvedValue(mockData);
    modalConfirmSpy = jest.spyOn(Modal, 'confirm');
    notificationInfoSpy = jest.spyOn(notification, 'info');
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('is defined', () => {
    expect(ImageFileTable).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <MemoryRouter>
        <ImageFileTable />
      </MemoryRouter>
    );
    expect(container).toBeVisible();

    await waitFor(() => {
      expect(screen.getByText('example.png')).toBeInTheDocument();
    });
    expect(container.querySelector('.imagefile-table')).toBeVisible();

    await waitFor(() => {
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
      expect(screen.getByText('example.png')).toBeInTheDocument();
    });
  });

  it('handles delete action', async () => {
    render(
      <MemoryRouter>
        <ImageFileTable />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('example.png')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('img', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(modalConfirmSpy).toHaveBeenCalled();
    });

    const confirmCall = modalConfirmSpy.mock.calls[0][0];
    await confirmCall.onOk();

    await waitFor(() => {
      expect(mockService.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(notificationInfoSpy).toHaveBeenCalledWith(expect.objectContaining({
        message: 'ImageFileTable.deletionInfo',
      }));
    });
  });
});
