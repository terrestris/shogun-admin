export interface SwaggerDocs {
  basePath: string;
  definitions: {
    [key: string]: any;
  };
  host: string;
  info: any;
  paths: {
    [key: string]: any;
  };
  securityDefinitions: {
    [key: string]: any;
  };
  swagger: string;
  tags: {
    name: string;
    description: string;
  }[];
}
