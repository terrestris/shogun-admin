import React from 'react';

import { ReloadOutlined } from '@ant-design/icons';
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';

import { Button, Tooltip } from 'antd';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import MetricService, { Metric } from '../../../Service/MetricService/MetricService';

import { MetricEntry } from './MetricEntry';

jest.mock('../../../Hooks/useSHOGunAPIClient', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../../Service/MetricService/MetricService');

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  Statistic: ({ value, prefix, suffix, title, formatter, ...props }: any) => (
    <div data-testid="statistic" {...props}>
      <div>{prefix}</div>
      <div>{title}</div>
      <div>{formatter ? formatter(value) : value}</div>
      <div>{suffix}</div>
    </div>
  ),
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Tooltip: ({ children, ...props }: any) => <div {...props}>{children}</div>
}));

describe('<MetricEntry />', () => {
  let getMetricMock;

  beforeEach(() => {
    (useSHOGunAPIClient as jest.Mock).mockReturnValue({
      getKeycloak: jest.fn()
    });

    getMetricMock = jest.fn();
    MetricService.mockImplementation(() => ({
      getMetric: getMetricMock,
    }));
  });

  it('is defined', () => {
    expect(MetricEntry).not.toBeUndefined();
  });

  it('should render correctly with data and call render functions', async () => {
    getMetricMock.mockResolvedValue({
      measurements: [{ value: 123 }],
      description: 'Test Metric'
    });

    const { container } = render(
      <MetricEntry
        type="test.type"
        prefixRenderer={(metric) => <span>{metric?.measurements[0]?.value} Prefix</span>}
        suffixRenderer={(metric) => <span>Suffix</span>}
        titleRenderer={(metric) => <span>{metric?.description} Title</span>}
        valueRenderer={(value) => <span>{value} Value</span>}
      />
    );
    expect(container).toBeVisible();

    expect(container.querySelector('.ant-card-loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('123 Prefix')).toBeInTheDocument();
      expect(screen.getByText('Suffix')).toBeInTheDocument();
      expect(screen.getByText('Test Metric Title')).toBeInTheDocument();
      expect(screen.getByText('123 Value')).toBeInTheDocument();
    });

    expect(container.querySelector('.ant-card-bordered')).toBeInTheDocument();

    const reloadButton = screen.getByRole('button', { name: /Reload/i });
    expect(reloadButton).toBeInTheDocument();

    fireEvent.click(reloadButton);
    await waitFor(() => {
      expect(getMetricMock).toHaveBeenCalled();
    });
  });
});
