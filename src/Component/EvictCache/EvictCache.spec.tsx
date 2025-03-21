import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';

import { EvictCache } from './EvictCache';

const mockCacheService = {
  evictCache: jest.fn()
};

const mockSHOGunAPIClient = {
  cache: jest.fn().mockReturnValue(mockCacheService),
};

jest.mock('../../Hooks/useSHOGunAPIClient', () => {
  const originalModule = jest.requireActual('../../Hooks/useSHOGunAPIClient');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => mockSHOGunAPIClient)
  };
});

describe('<EvictCache />', () => {

  afterEach(cleanup);

  it('is defined', () => {
    expect(EvictCache).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const {
      container
    } = render(
      <EvictCache />);
    expect(container).toBeVisible();
  });

  it('cache can be cleared', async () => {
    const {
      container
    } = render(
      <EvictCache />);
    expect(container).toBeVisible();

    const buttonElement = screen.getByText('EvictCache.clear');
    expect(buttonElement).toBeVisible();
    fireEvent.click(buttonElement);

    expect(mockSHOGunAPIClient.cache).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('EvictCache.success')).toBeVisible();
    });
  });
});
