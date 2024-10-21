import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import UserUtil from '../../Util/UserUtil';

import UserAvatar from './UserAvatar';


jest.mock('../../Util/UserUtil', () => ({
  getGravatarUrl: jest.fn()
}));

jest.mock('antd', () => ({
  Avatar: jest.fn(({ src, ...props }) => <img alt="avatar" src={src} {...props} />)
}));

describe('<UserAvatar />', () => {
  const mockUser = {
    providerDetails: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser'
    }
  };

  beforeEach(() => {
    UserUtil.getGravatarUrl.mockReturnValue('http://gravatar.com/avatar');
  });

  it('is defined', () => {
    expect(UserAvatar).not.toBeUndefined();
  });

  it('can be rendered and displays user details', () => {
    const {
      container
    } = render(
      <UserAvatar user={mockUser} />
    );
    expect(container).toBeVisible();

    const avatarImage = container.querySelector('img');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'http://gravatar.com/avatar');

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('passes additional props to the Avatar component', () => {
    const {
      container
    } = render(
      <UserAvatar
        user={mockUser}
        size="large"
      />
    );
    expect(container.querySelector('.ant-avatar-lg')).toBeInTheDocument();
  });
});
