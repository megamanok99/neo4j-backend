import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
