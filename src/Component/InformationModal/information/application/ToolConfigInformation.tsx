import { InformationModalTableDataType } from './../../types';

export const description = 'A small description about this field. Still TODO';

export const ToolConfigDocTableData: InformationModalTableDataType[] = [
  {
    propertyName: 'name',
    description: 'The name of the tool.',
    example: 'map-tool',
    dataType: 'string',
    required: 'yes',
  },
  {
    propertyName: 'clientConfig',
    description: 'The configuration object of the tool.' ,
    example: '',
    dataType: 'Object',
    required: 'no',
    subProps: [
      {
        propertyName: 'visible',
        description: 'If the tool is visible or not.' ,
        example: 'true',
        dataType: 'boolean',
        required: 'no'
      }
    ]
  }
];

export const exampleConfig = `[
  {
    "name": "measure_tools",
    "config": {
      "visible": true
    }
  },
  {
    "name": "measure_tools_distance",
    "config": {
      "visible": true
    }
  },
  {
    "name": "measure_tools_area",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools_point",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools_line",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools_polygon",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools_circle",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools_rectangle",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools_annotation",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools_modify",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools_upload",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools_download",
    "config": {
      "visible": true
    }
  },
  {
    "name": "draw_tools_delete",
    "config": {
      "visible": true
    }
  },
  {
    "name": "feature_info",
    "config": {
      "visible": true
    }
  },
  {
    "name": "print",
    "config": {
      "visible": true
    }
  },
  {
    "name": "tree",
    "config": {
      "visible": true
    }
  },
  {
    "name": "permalink",
    "config": {
      "visible": true
    }
  },
  {
    "name": "language_selector",
    "config": {
      "visible": true
    }
  }
]`;
