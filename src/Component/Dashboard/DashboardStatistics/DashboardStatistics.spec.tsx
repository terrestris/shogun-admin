import React from 'react';

import {
  cleanup,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';

import Application from '@terrestris/shogun-util/dist/model/Application';
import Layer from '@terrestris/shogun-util/dist/model/Layer';
import { Page } from '@terrestris/shogun-util/dist/model/Page';
import User from '@terrestris/shogun-util/dist/model/User';
import GenericEntityService from '@terrestris/shogun-util/dist/service/GenericEntityService';
import { PageOpts } from '@terrestris/shogun-util/dist/service/GenericService';

import { DashboardStatistics } from './DashboardStatistics';

const mockGenericEntityService = {
  findAllNoPaging: jest.fn(),
  findAll: jest.fn() as jest.Mock<Promise<Page<Application | User | Layer>>, [PageOpts?, RequestInit?]>,
  findOne: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  updatePartial: jest.fn(),
  delete: jest.fn(),
  isPublic: jest.fn(),
  setPublic: jest.fn(),
  revokePublic: jest.fn(),
  getBasePath: jest.fn()
} as unknown as GenericEntityService<Application | User | Layer>;

describe('<DashboardStatistics />', () => {
  let testName: {
    singular: string;
    plural: string;
  };

  beforeEach(() => {
    testName = {
      singular: 'Mock Layer',
      plural: 'Mock Layers',
    };

    const mockEntitiesResponse = {
      totalElements: 10,
      content: [{
        id: 1,
        name: 'Mock Layer'
      }]
    };

    (mockGenericEntityService.findAll as jest.Mock).mockResolvedValue(mockEntitiesResponse);
  });

  afterEach(cleanup);

  it('is defined', () => {
    expect(DashboardStatistics).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <DashboardStatistics
        service={mockGenericEntityService}
        name={testName}
      />);
    expect(container).toBeVisible();
    await waitForElementToBeRemoved(() => screen.queryByText(/-1 Mock Layer/i));
  });

  it('is rendered with statistics', async () => {
    const {
      container
    } = render(
      <DashboardStatistics
        service={mockGenericEntityService}
        name={testName}
      />);
    const statisticsElement = container.querySelector('.statistics-card');
    expect(statisticsElement).toBeVisible();

    const titleElement = screen.getByText('DashboardStatistics.statisticsTitle');
    expect(titleElement).toBeVisible();

    expect(container.innerHTML).toContain('-1 Mock Layer');
    await waitForElementToBeRemoved(() => screen.queryByText(/-1 Mock Layer/i));

    expect(mockGenericEntityService.findAll).toHaveBeenCalledWith({
      page: 0,
      size: 1
    });

    expect(container.innerHTML).toContain('10 Mock Layers');
  });
});
