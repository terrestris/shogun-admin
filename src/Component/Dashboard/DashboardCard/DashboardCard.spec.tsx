import React from 'react';

import {
  render,
  screen
} from '@testing-library/react';

import { DashboardCard } from './DashboardCard';

describe('<DashboardCard />', () => {

  it('is defined', () => {
    expect(DashboardCard).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const {
      container
    } = render(<DashboardCard />);
    expect(container).toBeVisible();

    const bodyElement = container.querySelector('.dashboard-card-body');
    expect(bodyElement).toBeVisible();
  });

  it('properties are rendered', () => {
    const testActions = ['test-action1', 'test-action2'];
    const actionWidth = 100 / testActions.length;

    render(
      <DashboardCard
        actions={testActions}
        avatar={'test-avatar'}
        description={'test-description'}
        title={'test-title'}
      />);
    const actionElement = screen.getByText('test-action1');
    expect(actionElement).toBeVisible();
    expect(actionElement.parentElement).toHaveStyle(`width: ${actionWidth}%;`);
  });

  it('can be made hoverable', () => {
    const {
      container
    } = render(
      <DashboardCard
        hoverable={true}
      />);
    const cardElement = container.querySelector('.hoverable');
    expect(cardElement).toBeVisible();
  });
});
