import File, { FileArgs } from './File';

export interface ImageFileArgs extends FileArgs {
  width?: number;
  height?: number;
  thumbnail?: Uint8Array;
}

export default class ImageFile extends File {
  width?: number;
  height?: number;
  thumbnail?: Uint8Array;

  constructor({id, created, modified, fileName, fileUuid, fileType, file, width, height, thumbnail}: ImageFileArgs) {
    super({id, created, modified, fileName, fileUuid, fileType, file});

    this.width = width;
    this.height = height;
    this.thumbnail = thumbnail;
  }
}
