import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Customer } from './customer.model';
import { Product } from './product.model';
import { Supplier } from './supplier.model';

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

  @Field(() => Customer, { nullable: true })
  customer?: Customer;

  @Field(() => Supplier, { nullable: true })
  winner?: Supplier;

  @Field(() => [Product], { nullable: 'itemsAndList' })
  products?: Product[];
}

@InputType()
export class ProductInput {
  @Field()
  code: string;

  @Field()
  name: string;
}

@InputType()
export class CompanyInput {
  @Field()
  inn: string;

  @Field()
  name: string;
}

@InputType()
export class TenderInput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  publishDate: string;

  @Field()
  closeDate: string;

  @Field(() => Int)
  price: number;

  @Field(() => CompanyInput)
  customer: CompanyInput;

  @Field(() => CompanyInput)
  winner: CompanyInput;

  @Field(() => [ProductInput])
  products: ProductInput[];
}
