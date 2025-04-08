import { Field, ObjectType } from '@nestjs/graphql';
import { Customer } from './customer.model';
import { Supplier } from './supplier.model';
import { Product } from './product.model';

@ObjectType()
export class Tender {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  publishDate: string;

  @Field()
  closeDate: string;

  @Field()
  price: number;

  @Field(() => Customer)
  customer: Customer;

  @Field(() => Supplier, { nullable: true })
  winner?: Supplier;

  @Field(() => [Product], { nullable: 'itemsAndList' })
  products?: Product[];
}
