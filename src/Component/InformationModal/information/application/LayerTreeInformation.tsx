export const description = 'A small description about this field. Still TODO';

export const exampleConfig = `
  {
    "title": "root",
    "children": [
      {
        "title": "Copernicus Services",
        "checked": false,
        "children": [
          {
            "title": "Land - VHR Mosaic",
            "checked": false,
            "children": [
              {
                "title": "VHR 2018",
                "checked": false,
                "layerId": 325
              },
              {
                "title": "VHR 2012",
                "checked": false,
                "layerId": 324
              }
            ]
          },
          {
            "title": "Surfaceobservation - ESA WorldCover",
            "checked": false,
            "children": [
              {
                "title": "Worldcover 2020",
                "checked": false,
                "layerId": 328
              }
            ]
          }
        ]
      },
      {
        "title": "Community Contributions",
        "checked": true,
        "children": [
          {
            "title": "Incora",
            "checked": true,
            "children": [
              {
                "title": "Land Cover 2016",
                "checked": false,
                "layerId": 321
              },
              {
                "title": "Land Cover 2019",
                "checked": false,
                "layerId": 322
              },
              {
                "title": "Land Cover 2020",
                "checked": true,
                "layerId": 323
              }
            ]
          },
          {
            "title": "Building Heigt Map (DE)",
            "checked": false,
            "layerId": 329
          },
          {
            "title": "Land Cover Fraction Map (DE)",
            "checked": false,
            "layerId": 327
          }
        ]
      },
      {
        "title": "Countries",
        "checked": true,
        "layerId": 47
      },
      {
        "title": "Backgroundlayer",
        "checked": true,
        "children": [
          {
            "title": "GEBCO",
            "checked": false,
            "layerId": 330
          },
          {
            "title": "OSM-WMS",
            "checked": false,
            "layerId": 326
          },
          {
            "title": "OSM-WMS (gray)",
            "checked": true,
            "layerId": 46
          }
        ]
      },
      {
        "title": "Countries",
        "checked": false,
        "layerId": 47
      }
    ]
  }
`;

