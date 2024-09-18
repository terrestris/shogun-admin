import React from 'react';

import {
  cleanup,
  render,
  screen,
} from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import Header from './Header';

jest.mock('shogunApplicationConfig', () => ({
  path: {
    logo: 'test-path',
    appPrefix: 'testRef'
  },
}));

describe('<Header />', () => {

  afterEach(() => {
    cleanup();
  });

  it('is defined', () => {
    expect(Header).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <RecoilRoot>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </RecoilRoot>
    );
    expect(container).toBeVisible();
    expect(container.querySelector('.page-header')).toBeVisible();
  });

  it('renders logo', async () => {
    const {
      container
    } = render(
      <RecoilRoot>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </RecoilRoot>
    );
    expect(container).toBeVisible();

    const logoElem = container.querySelector('.header-logo');

    expect(logoElem).toBeVisible();
    expect(logoElem).toHaveAttribute('src', 'test-path');
  });

  it('renders title with link', async () => {
    const {
      container
    } = render(
      <RecoilRoot>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </RecoilRoot>
    );
    expect(container).toBeVisible();

    const titleElement = screen.getByText('SHOGun Admin');
    expect(titleElement!).toBeVisible();

    expect(container.querySelector('.header-link')!).toHaveProperty('href', 'http://localhost/undefined/portal');
  });

  it('renders language selector', async () => {
    const {
      container
    } = render(
      <RecoilRoot>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </RecoilRoot>
    );
    expect(container).toBeVisible();

    expect(container.querySelector('.language-select')).toBeVisible();
  });
});
