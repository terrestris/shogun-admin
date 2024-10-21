import React from 'react';

import {
  cleanup,
  render
} from '@testing-library/react';

import { WelcomeDashboard } from './WelcomeDashboard';

const mockSHOGunAPIClient = jest.fn().mockResolvedValue('test-client');

jest.mock('../../Hooks/useSHOGunAPIClient', () => {
  const originalModule = jest.requireActual('../../Hooks/useSHOGunAPIClient');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() =>  mockSHOGunAPIClient)
  };
});

describe('<WelcomeDashboard />', () => {

  afterEach(cleanup);

  it('is defined', () => {
    expect(WelcomeDashboard).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <WelcomeDashboard />);
    expect(container).toBeVisible();

    expect(container.querySelector('.title')?.innerHTML).toBe('Dashboard');

    expect(container.querySelector('.welcome-dashboard')).toBeVisible();
  });
});
