import { describe, it, expect } from 'vitest';

import { JdbcConnectionsActive } from './JdbcConnectionsActive';

describe('<JdbcConnectionsActive />', () => {

  it('is defined', () => {
    expect(JdbcConnectionsActive).not.toBeUndefined();
  });

});
