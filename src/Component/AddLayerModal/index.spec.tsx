import React from 'react';

import userEvent from '@testing-library/user-event';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';

import {
  PartialOmit,
} from '../../test-util';

import AddLayerModal from '.';
import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

import CapabilitiesUtil from '@terrestris/ol-util/dist/CapabilitiesUtil/CapabilitiesUtil';

jest.mock('@terrestris/shogun-util/dist/security/getBearerTokenHeader', () => ({
  getBearerTokenHeader: jest.fn(() => ({
    Authorization: '123'
  }))
}));

const mockSHOGunAPIClient: PartialOmit<SHOGunAPIClient, 'graphql' | 'layer' | 'getKeycloak'> = {
  getKeycloak: jest.fn(),
  graphql: jest.fn().mockReturnValue({
    sendQuery: jest.fn().mockReturnValue({
      allLayers: [{
        id: 123,
        name: 'TestLayer',
        sourceConfig: {
          url: 'http://localhost/geoserver/ows',
          layerNames: 'TEST:TEST1',
          useBearerToken: true
        }
      }]
    })
  }),
  layer: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnValue({})
  })
};

jest.mock('../../Hooks/useSHOGunAPIClient', () => {
  const originalModule = jest.requireActual('../../Hooks/useSHOGunAPIClient');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => mockSHOGunAPIClient)
  };
});

describe('<AddLayerModal />', () => {
  const capabilitiesMock = {
    Capability: {
      Request: {
        GetMap: {
          DCPType: {
            HTTP: {
              Get: {
                OnlineResource: {
                  type: 'simple',
                  href: 'http://localhost/geoserver/ows?SERVICE=WMS&'
                }
              }
            }
          }
        }
      },
      Layer: {
        Title: '',
        Abstract: '',
        Layer: [{
          Name: 'TEST:TEST1',
          Title: 'Test Layer 1',
          queryable: '1',
          opaque: '0'
        }, {
          Name: 'TEST:TEST2',
          Title: 'Test Layer 2',
          queryable: '0',
          opaque: '0'
        }, {
          Name: 'TEST:TEST3',
          Title: 'Test Layer 3',
          queryable: '1',
          opaque: '0'
        }]
      }
    }
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });

  it('can be rendered', () => {
    const {
      container
    } = render(
      <AddLayerModal
        open={true}
      />
    );

    expect(container).toBeVisible();
  });

  it('validates the given capabilities url', async () => {
    render(
      <AddLayerModal
        open={true}
      />
    );

    const input = screen.getByDisplayValue('http://localhost/geoserver/ows');

    fireEvent.change(input, { target: { value: 'http//localhost/geoserver/ows' } });

    screen.getByText('AddLayerModal.invalidUrlErrorMsg');

    fireEvent.change(input, { target: { value: 'htt://localhost/geoserver/ows' } });

    screen.getByText('AddLayerModal.invalidUrlErrorMsg');

    fireEvent.change(input, { target: { value: 'htt://localhost/geoserver/ows' } });

    screen.getByText('AddLayerModal.invalidUrlErrorMsg');

    fireEvent.change(input, { target: { value: 'peter://localhost/geoserver/ows' } });

    screen.getByText('AddLayerModal.invalidUrlErrorMsg');

    fireEvent.change(input, { target: { value: 'https://localhost/geoserver/ows' } });

    expect(screen.queryByText('AddLayerModal.invalidUrlErrorMsg')).toBeNull();
  });

  it('loads the existing layers on startup', () => {
    render(
      <AddLayerModal
        open={true}
      />
    );

    expect(mockSHOGunAPIClient.graphql().sendQuery).toHaveBeenCalledTimes(1);
    expect(mockSHOGunAPIClient.graphql().sendQuery).toHaveBeenCalledWith({
      query:
        'query {' +
        '  allLayers {' +
        '    id' +
        '    name' +
        '    sourceConfig' +
        '  }' +
        '}'
    });
  });

  it('requests the WMS GetCapabilities with the selected WMS version', async () => {
    render(
      <AddLayerModal
        open={true}
      />
    );

    const button = screen.getAllByRole('button')[1];

    const input = screen.getByRole('combobox');

    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getAllByText('AddLayerModal.version')[4]).toBeVisible();
    });

    fireEvent.click(screen.getAllByText('AddLayerModal.version')[4]);

    const spy = jest.spyOn(CapabilitiesUtil, 'getWmsCapabilities')
      .mockReturnValue(new Promise(resolve => resolve(capabilitiesMock)));

    fireEvent.click(button);

    expect(spy).toHaveBeenLastCalledWith(
      'http://localhost/geoserver/ows?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.0.0',
      {
        headers: {}
      }
    );
  }, 10000);

  it('requests the GetCapabilities with the given url', async () => {
    const spy = jest.spyOn(CapabilitiesUtil, 'getWmsCapabilities')
      .mockReturnValue(new Promise(resolve => resolve({})));

    render(
      <AddLayerModal
        open={true}
      />
    );

    const button = screen.getAllByRole('button')[1];

    const input = screen.getByRole('combobox');
    const input1 = screen.getByLabelText('input-search');

    fireEvent.change(input1, {target: {value: 'http://localhost:1234/geoserver/ows'}})

    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getAllByText('AddLayerModal.version')[4]).toBeVisible();
    });

    fireEvent.click(screen.getAllByText('AddLayerModal.version')[4]);

    fireEvent.click(button);

    expect(spy).toHaveBeenLastCalledWith(
      'http://localhost:1234/geoserver/ows?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.0.0',
      {
        headers: {}
      }
    );
  }, 10000);

  it('requests the GetCapabilities with the bearer token', async () => {
    render(
      <AddLayerModal
        open={true}
      />
    );

    const spy = jest.spyOn(CapabilitiesUtil, 'getWmsCapabilities')
      .mockReturnValue(new Promise(resolve => resolve(capabilitiesMock)));

    const button = screen.getAllByRole('button')[1];

    const input = screen.getByRole('combobox');

    const authSwitch = screen.getByLabelText('use-bearer-token');

    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getAllByText('AddLayerModal.version')[4]).toBeVisible();
    });

    fireEvent.click(screen.getAllByText('AddLayerModal.version')[4]);

    fireEvent.click(authSwitch);

    fireEvent.click(button);

    expect(spy).toHaveBeenCalledWith(
      'http://localhost/geoserver/ows?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.0.0',
      {
        headers: {
          Authorization: '123'
        }
      }
    );
  }, 10000);

  it('shows the requested layers in a table', async () => {
    render(
      <AddLayerModal
        open={true}
      />
    );

    const input = screen.getByRole('combobox');

    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getAllByText('AddLayerModal.version')[4]).toBeVisible();
    });

    fireEvent.click(screen.getAllByText('AddLayerModal.version')[4]);

    const button = screen.getAllByRole('button')[1];

    jest.spyOn(CapabilitiesUtil, 'getWmsCapabilities')
      .mockReturnValue(new Promise(resolve => resolve(capabilitiesMock)));

    await userEvent.click(button);

    expect(screen.getByText('TEST:TEST1')).toBeVisible();
    expect(screen.getByText('Test Layer 1')).toBeVisible();

    expect(screen.getByText('TEST:TEST2')).toBeVisible();
    expect(screen.getByText('Test Layer 2')).toBeVisible();

    expect(screen.getByText('TEST:TEST3')).toBeVisible();
    expect(screen.getByText('Test Layer 3')).toBeVisible();
  }, 10000);

  it('shows if the remote layers already exist and persists the layers', async () => {
    render(
      <AddLayerModal
        open={true}
      />
    );

    const input = screen.getByRole('combobox');

    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getAllByText('AddLayerModal.version')[4]).toBeVisible();
    });

    fireEvent.click(screen.getAllByText('AddLayerModal.version')[4]);

    const button = screen.getAllByRole('button')[1];

    jest.spyOn(CapabilitiesUtil, 'getWmsCapabilities')
      .mockReturnValue(new Promise(resolve => resolve(capabilitiesMock)));

    await userEvent.click(button);

    // Add the close button and the auth switch.
    expect(screen.getAllByLabelText('check')).toHaveLength(1 + 1);
    expect(screen.getAllByLabelText('close')).toHaveLength(3 + 1);

    const addButton = screen.getByText('AddLayerModal.addAllLayers');

    await userEvent.click(addButton);

    expect(mockSHOGunAPIClient.layer().add).toHaveBeenCalledTimes(3);
    expect(mockSHOGunAPIClient.layer().add).toHaveBeenNthCalledWith(1, {
      type: 'WMS',
      name: 'Test Layer 1',
      sourceConfig: {
        url: 'http://localhost/geoserver/ows?SERVICE=WMS&',
        layerNames: 'TEST:TEST1',
        useBearerToken: false,
        attribution: undefined,
        requestParams: {
          VERSION: '1.0.0'
        }
      },
      clientConfig: {
        hoverable: true
      }
    });
    expect(mockSHOGunAPIClient.layer().add).toHaveBeenNthCalledWith(2, {
      type: 'WMS',
      name: 'Test Layer 2',
      sourceConfig: {
        url: 'http://localhost/geoserver/ows?SERVICE=WMS&',
        layerNames: 'TEST:TEST2',
        useBearerToken: false,
        attribution: undefined,
        requestParams: {
          VERSION: '1.0.0'
        }
      },
      clientConfig: {
        hoverable: false
      }
    });
    expect(mockSHOGunAPIClient.layer().add).toHaveBeenNthCalledWith(3, {
      type: 'WMS',
      name: 'Test Layer 3',
      sourceConfig: {
        url: 'http://localhost/geoserver/ows?SERVICE=WMS&',
        layerNames: 'TEST:TEST3',
        useBearerToken: false,
        attribution: undefined,
        requestParams: {
          VERSION: '1.0.0'
        }
      },
      clientConfig: {
        hoverable: true
      }
    });
  }, 10000);
});
