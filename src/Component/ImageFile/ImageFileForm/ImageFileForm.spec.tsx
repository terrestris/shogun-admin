import React from 'react';

import { render, screen } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import { describe, it, beforeEach, afterEach, expect } from 'vitest';

import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';
import { fetchSpy, successResponse } from '@terrestris/shogun-util/dist/spec/fetchSpy';

import { SHOGunAPIClientProvider } from '../../../Context/SHOGunAPIClientContext';

import { ImageFileForm } from './ImageFileForm';

describe('<ImageFileForm />', () => {

  let client: SHOGunAPIClient;
  let wrapper: React.FC;

  let fetchMock= fetchSpy(successResponse({}));

  beforeEach(() => {
    fetchMock = fetchSpy(successResponse({
      public: true
    }));
    client = new SHOGunAPIClient();
    const sendQuery = jest.fn().mockReturnValue({
      imageFileById: {}
    });
    client.graphql = jest.fn().mockImplementation(() => ({
      sendQuery
    }));
    wrapper = ({children}: any) => {
      return (
        <SHOGunAPIClientProvider client={client}>
          <MemoryRouter initialEntries={['/undefined/portal/imagefile/119']}>
            {children}
          </MemoryRouter>
        </SHOGunAPIClientProvider>
      );
    };
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is defined', () => {
    expect(ImageFileForm).not.toBeUndefined();
  });

  it('renders the form correctly', () => {
    render(<ImageFileForm />, { wrapper });
    expect(screen.getByText('ImageFileForm.title')).toBeInTheDocument();
    expect(screen.getByText('ImageFileForm.name')).toBeInTheDocument();
    expect(screen.getByText('ImageFileForm.uuid')).toBeInTheDocument();
    expect(screen.getByText('ImageFileForm.public')).toBeInTheDocument();
    expect(screen.getByText('ImageFileForm.preview')).toBeInTheDocument();
  });

  it('`isPublic` state is fetched initially', () => {
    render(<ImageFileForm />, { wrapper });
    expect(fetchMock).toHaveBeenCalledWith('/imagefiles/119/permissions/public', {
      headers: {}
    });
  });

});
