import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field()
  code: string;

  @Field()
  name: string;
}
