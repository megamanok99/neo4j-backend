
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Customer {
    inn: string;
    name: string;
}

export class Supplier {
    inn: string;
    name: string;
}

export class Product {
    code: string;
    name: string;
}

export class Tender {
    id: string;
    title: string;
    description?: Nullable<string>;
    publishDate: string;
    closeDate: string;
    price: number;
    customer: Customer;
    winner?: Nullable<Supplier>;
    products?: Nullable<Nullable<Product>[]>;
}

export abstract class IQuery {
    abstract tenders(): Tender[] | Promise<Tender[]>;
}

type Nullable<T> = T | null;
