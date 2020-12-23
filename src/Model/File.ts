import BaseEntity, { BaseEntityArgs } from './BaseEntity';

export interface FileArgs extends BaseEntityArgs {
  fileName?: string;
  fileUuid?: string;
  fileType?: string;
  file?: Uint8Array;
}

export default class Application extends BaseEntity {
  fileName?: string;
  fileUuid?: string;
  fileType?: string;
  file?: Uint8Array;

  constructor({id, created, modified, fileName, fileUuid, fileType, file}: FileArgs) {
    super({id, created, modified});

    this.fileName = fileName;
    this.fileUuid = fileUuid;
    this.fileType = fileType;
    this.file = file;
  }
}
