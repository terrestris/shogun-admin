export interface InformationModalTableDataType {
  propertyName: string;
  parent?: string;
  description: string;
  example: string | number;
  dataType: string;
  required: string;
  subProps?: InformationModalTableDataType[];
  keyId: string;
}

export interface GroupedInformationModalTableDataType {
  [key: string]: InformationModalTableDataType[];
}
