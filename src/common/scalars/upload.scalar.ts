import { Scalar } from '@nestjs/graphql';
import Upload from 'graphql-upload/Upload.mjs';

@Scalar('Upload', () => Upload)
export class UploadScalar {
  description = 'Upload custom scalar type';

  parseValue(value: any) {
    return value;
  }

  serialize(value: any) {
    return value;
  }

  parseLiteral(ast: any) {
    return ast;
  }
}
