import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field()
  inn: string;

  @Field()
  name: string;
}
