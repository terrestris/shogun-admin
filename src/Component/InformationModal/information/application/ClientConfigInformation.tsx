import { InformationModalTableDataType } from './../../types';

export const description = 'A small description about this field. Still TODO';

export const ClientConfigDocTableData: InformationModalTableDataType[] = [
  {
    propertyName: 'mapView',
    description: 'The configuration of the map view.',
    example: '',
    dataType: 'Object',
    required: 'yes',
    subProps: [
      {
        propertyName: 'zoom',
        description: 'The initial zoom level of the map.',
        example: '1',
        dataType: 'number',
        required: 'no',
      },
      {
        propertyName: 'center',
        description: 'The initial center of the map (in WGS84)',
        example: '[10.3, 51.08]',
        dataType: '[number, number]',
        required: 'no',
      },
      {
        propertyName: 'extent',
        description: 'The maximum extent of the map (in WGS84).',
        example: '[2.5683045738288137, 45.429089001638076, 19.382621082401887, 57.283993958205926]',
        dataType: '[number, number, number, number]',
        required: 'no',
      },
      {
        propertyName: 'projection',
        description: 'The projection of the map.',
        example: 'EPSG:25832',
        dataType: 'string',
        required: 'no',
      },
      {
        propertyName: 'resolutions',
        description: 'The list of resolutions/zoom levels of the map.',
        example: '[2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.298582142, 0.149291071, 0.074645535]',
        dataType: 'number[]',
        required: 'no',
      }
    ]
  },
  {
    propertyName: 'description',
    description: 'The description of the application.',
    example: 'This is an app',
    dataType: 'string',
    required: 'no',
  },
  {
    propertyName: 'theme',
    description: 'The configuration of the applications theme.',
    example: '',
    dataType: 'Object',
    required: 'no',
    subProps: [
      {
        propertyName: 'primaryColor',
        description: 'The primary color.',
        example: '#fffff',
        dataType: 'string',
        required: 'no',
      },
      {
        propertyName: 'secondaryColor',
        description: 'The secondary color.',
        example: '#fffff',
        dataType: 'string',
        required: 'no',
      },
      {
        propertyName: 'complementaryColor',
        description: 'The complementary color (e.g. text color, icon color on buttons, …).',
        example: '#fffff',
        dataType: 'string',
        required: 'no',
      },
      {
        propertyName: 'logoPath',
        description: 'The path to the logo.',
        example: 'http://path-to-the-logo.de',
        dataType: 'string',
        required: 'no',
      }
    ]
  }
];

export const exampleConfig = `
  {
    "mapView": {
      "zoom": 2,
      "center": [
        10,
        51
      ],
      "extent": null,
      "projection": "EPSG:3857",
      "resolutions": [
        8920,
        4480,
        2240,
        1120,
        560,
        350,
        280,
        140,
        70,
        28,
        14,
        7,
        2.8,
        1.4,
        0.7,
        0.28,
        0.07
      ]
    },
    "description": "EO-Lab",
    "theme": {
      "primaryColor": "#02203d",
      "secondaryColor": "#73b3fb",
      "complementaryColor": "#ffffff",
      "logoPath": "https://cloud.code-de.org:8080/279dbc97d5b5434fa8aeacf09c08c520:eolab_prod/static/img/eolab1.png"
    }
  }
`;
