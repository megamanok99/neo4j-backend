import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Supplier {
  @Field()
  inn: string;

  @Field()
  name: string;
}
