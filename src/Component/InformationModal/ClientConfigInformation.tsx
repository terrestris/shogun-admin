import { InformationModalTableDataType } from '../types';

export const ClientConfigDocTableData: InformationModalTableDataType[] = [
  {
    propertyName: 'mapView',
    description: 'The configuration of the map view.',
    example: '',
    dataType: 'Object',
    mandatory: 'yes',
    subProps: [
      {
        propertyName: 'zoom',
        description: 'The initial zoom level of the map.',
        example: '1',
        dataType: 'number',
        mandatory: 'no',
      },
      {
        propertyName: 'center',
        description: 'The initial center of the map (in WGS84)',
        example: '[10.3, 51.08]',
        dataType: '[number, number]',
        mandatory: 'no',
      },
      {
        propertyName: 'extent',
        description: 'The maximum extent of the map (in WGS84).',
        example: '[2.5683045738288137, 45.429089001638076, 19.382621082401887, 57.283993958205926]',
        dataType: '[number, number, number, number]',
        mandatory: 'no',
      },
      {
        propertyName: 'projection',
        description: 'The projection of the map.',
        example: 'EPSG:25832',
        dataType: 'string',
        mandatory: 'no',
      },
      {
        propertyName: 'resolutions',
        description: 'The list of resolutions/zoom levels of the map.',
        example: '[2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.298582142, 0.149291071, 0.074645535]',
        dataType: 'number[]',
        mandatory: 'no',
      }
    ]
  },
  {
    propertyName: 'description',
    description: 'The description of the application.',
    example: 'This is an app',
    dataType: 'string',
    mandatory: 'no',
  },
  {
    propertyName: 'theme',
    description: 'The configuration of the applications theme.',
    example: '',
    dataType: 'Object',
    mandatory: 'no',
    subProps: [
      {
        propertyName: 'primaryColor',
        description: 'The primary color.',
        example: '#fffff',
        dataType: 'string',
        mandatory: 'no',
      },
      {
        propertyName: 'secondaryColor',
        description: 'The secondary color.',
        example: '#fffff',
        dataType: 'string',
        mandatory: 'no',
      },
      {
        propertyName: 'complementaryColor',
        description: 'The complementary color (e.g. text color, icon color on buttons, …).',
        example: '#fffff',
        dataType: 'string',
        mandatory: 'no',
      },
      {
        propertyName: 'logoPath',
        description: 'The path to the logo.',
        example: 'http://path-to-the-logo.de',
        dataType: 'string',
        mandatory: 'no',
      }
    ]
  }
];
