import React from 'react';

import {
  render
} from '@testing-library/react';

import User from '@terrestris/shogun-util/dist/model/User';

import VerifyProviderDetailsField from './VerifyProviderDetailsField';

describe('<VerifyProviderDetailsField />', () => {

  it('can be rendered', () => {
    const user = new User({});

    const { container } = render(
      <VerifyProviderDetailsField
        value="1234"
        record={user}
      />
    );

    expect(container).toBeVisible();
  });

  it('shows the provided value (and no warning)', () => {
    const user = new User({
      providerDetails: {
        email: 'test@example.com'
      }
    });

    const {
      queryByText,
      queryByRole
    } = render(
      <VerifyProviderDetailsField
        value="1234"
        record={user}
      />
    );

    const displayValue = queryByText('1234');

    expect(displayValue).toBeVisible();

    const warningIcon = queryByRole('img');

    expect(warningIcon).toBeNull();
  });

  it('shows the provided value and a warning if the provider details aren\'t available', () => {
    const user = new User({});

    const {
      queryByRole,
      queryByText
    } = render(
      <VerifyProviderDetailsField
        value="1234"
        record={user}
      />
    );

    const displayValue = queryByText('1234');

    expect(displayValue).toBeVisible();

    const warningIcon = queryByRole('img');

    expect(warningIcon).toBeVisible();
  });

});
