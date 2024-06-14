import { describe, it, expect } from 'vitest';

import { User } from './User';

describe('<User />', () => {

  it('is defined', () => {
    expect(User).not.toBeUndefined();
  });

});
