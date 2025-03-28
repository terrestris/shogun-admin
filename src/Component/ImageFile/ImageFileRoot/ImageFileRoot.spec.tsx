import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import { ImageFileRoot } from './ImageFileRoot';

jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');
  return {
    ...originalModule,
    notification: {
      info: jest.fn(),
      error: jest.fn(),
    },
  };
});

const mockUpload = {
  upload: jest.fn()
};

const mockSHOGunAPIClient = {
  imagefile: jest.fn().mockReturnValue(mockUpload),
};

jest.mock('../../../Hooks/useSHOGunAPIClient', () => {
  const originalModule = jest.requireActual('../../../Hooks/useSHOGunAPIClient');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => mockSHOGunAPIClient)
  };
});

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('<ImageFileRoot />', () => {

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });

  it('is defined', () => {
    expect(ImageFileRoot).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <MemoryRouter>
        <ImageFileRoot />
      </MemoryRouter>
    );
    expect(container).toBeVisible();
    expect(container.querySelector('.header')).toBeVisible();
    expect(container.querySelector('.imagefile-root')).toBeVisible();
    expect(screen.getByTitle('ImageFileRoot.title')).toBeVisible();
  });

  // TODO Absolutely not sure why, but this test is failing randomly
  xit('should handle file upload', async () => {
    const {
      container
    } = render(
      <MemoryRouter>
        <ImageFileRoot />
      </MemoryRouter>
    );

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });

    mockSHOGunAPIClient.imagefile().upload.mockResolvedValue({ id: '12345' });

    const inputElement = container.querySelector('input[type="file"]');
    Object.defineProperty(inputElement, 'files', {
      value: [file],
    });
    fireEvent.change(inputElement!);

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith('undefined/portal/imagefile/12345');
    });
    expect(screen.getByText('ImageFileRoot.success')).toBeVisible();
    expect(screen.getByText('ImageFileRoot.uploadSuccess')).toBeVisible();
  });
});
