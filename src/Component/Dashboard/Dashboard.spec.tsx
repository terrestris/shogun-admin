import React from 'react';

import {
  render,
  screen
} from '@testing-library/react';

import { Dashboard } from './Dashboard';

describe('<Dashboard />', () => {

  it('is defined', () => {
    expect(Dashboard).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const {
      container
    } = render(<Dashboard />);
    expect(container).toBeVisible();

    const dashboardElement = container.querySelector('.dashboard');
    expect(dashboardElement).toBeVisible();

    const headerElement = container.querySelector('.header');
    expect(headerElement).toBeVisible();
  });

  it('properties are rendered', () => {
    const {
      container
    } = render(
      <Dashboard
        actions={'test-action'}
        icon={'test-icon'}
        columns={3}
        rows={3}
        title={'test-title'}
      />);

    const iconElement = screen.getByAltText('test-title icon');
    expect(iconElement).toBeVisible();
    expect(iconElement).toHaveAttribute('src', 'test-icon');

    const titleElement = screen.getByText('test-title');
    expect(titleElement).toBeVisible();

    const actionsElement = screen.getByText('test-action');
    expect(actionsElement).toBeVisible();

    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeVisible();
    expect(gridElement).toHaveStyle('grid-template-columns: repeat(3, 1fr);');
  });
});
