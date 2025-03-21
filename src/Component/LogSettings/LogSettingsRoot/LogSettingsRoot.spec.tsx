import React from 'react';

import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';

import { useNavigate } from 'react-router-dom';

import { LogSettingsRoot } from './LogSettingsRoot';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: any) => key
  })
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../LogLevelTable/LogLevelTable', () => () => <div>LogLevelTable</div>);

describe('<LogSettingsRoot />', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is defined', () => {
    expect(LogSettingsRoot).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const {
      container
    } = render(
      <LogSettingsRoot />
    );
    expect(container).toBeVisible();

    expect(screen.getByText('LogSettings.logs')).toBeInTheDocument();
    expect(screen.getByText('LogSettings.logsInfo')).toBeInTheDocument();
    expect(screen.getByText('LogLevelTable')).toBeInTheDocument();
  });

  it('calls navigate with -1 when onBack is clicked', () => {
    render(<LogSettingsRoot />);

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

