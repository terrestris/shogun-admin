import * as React from 'react';
import { shallow } from 'enzyme';
import { UserProfileForm } from './UserProfileForm';
import User from '../../../../Model/User';

const user = new User({
  username: 'Peter',
  email: 'peter@pan.nvl'
});

describe('<UserProfilForm />', () => {

  it('is defined', () => {
    expect(UserProfileForm).toBeDefined();
  });

  it('can be rendered', () => {
    const wrapper = shallow(<UserProfileForm
      user={user}
    />);
    expect(wrapper).toBeDefined();
  });

});
