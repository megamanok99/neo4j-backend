import { Inject, Injectable } from '@nestjs/common';
import { Connection, node, relation } from 'cypher-query-builder';

@Injectable()
export class TenderService {
  constructor(@Inject('NEO4J') private readonly db: Connection) {}

  async getAllTenders(): Promise<any[]> {
    const res = await this.db
      .match([
        node('c', 'Customer'),
        relation('out', 'PUBLISHED'),
        node('t', 'Tender'),
      ])
      .optionalMatch([
        node('t'),
        relation('out', 'AWARDED_TO'),
        node('s', 'Supplier'),
      ])
      .optionalMatch([
        node('t'),
        relation('out', 'INCLUDES_PRODUCT'),
        node('p', 'Product'),
      ])
      .return([
        't.id AS id',
        't.title AS title',
        't.description AS description',
        't.publishDate AS publishDate',
        't.closeDate AS closeDate',
        't.price AS price',
        'c { .inn, .name } AS customer',
        's { .inn, .name } AS winner',
        'collect(p { .code, .name }) AS products',
      ])
      .run();

    return res.map((tender) => ({
      ...tender,
      publishDate: formatNeo4jDate(tender.publishDate),
      closeDate: formatNeo4jDate(tender.closeDate),
    }));
  }
  async getTenderById(id: string): Promise<any> {
    const [tender] = await this.db
      .match([
        node('c', 'Customer'),
        relation('out', 'PUBLISHED'),
        node('t', 'Tender'),
      ])
      .optionalMatch([
        node('t'),
        relation('out', 'AWARDED_TO'),
        node('s', 'Supplier'),
      ])
      .optionalMatch([
        node('t'),
        relation('out', 'INCLUDES_PRODUCT'),
        node('p', 'Product'),
      ])
      .return([
        't.id AS id',
        't.title AS title',
        't.description AS description',
        't.publishDate AS publishDate',
        't.closeDate AS closeDate',
        't.price AS price',
        'c { .inn, .name } AS customer',
        's { .inn, .name } AS winner',
        'collect(p { .code, .name }) AS products',
      ])
      .run();
    return {
      ...tender,
    };
  }

  async createTender(input: any): Promise<any> {
    const { customer, winner, products, ...tender } = input;

    try {
      await this.db
        .query()
        .raw(
          `
          CREATE (t:Tender {
            id: $id,
            title: $title,
            description: $description,
            publishDate: date($publishDate),
            closeDate: date($closeDate),
            price: toInteger($price)
          })
          MERGE (c:Customer {inn: $customerInn})
            ON CREATE SET c.name = $customerName
          MERGE (w:Winner {inn: $winnerInn})
            ON CREATE SET w.name = $winnerName
          MERGE (c)-[:PLACED]->(t)
          MERGE (w)-[:WON]->(t)
          WITH t
          UNWIND $products AS product
            MERGE (p:Product {code: product.code})
            ON CREATE SET p.name = product.name
            MERGE (t)-[:INCLUDES]->(p)
          `,
          {
            id: tender.id,
            title: tender.title,
            description: tender.description,
            publishDate: tender.publishDate,
            closeDate: tender.closeDate,
            price: tender.price,
            customerInn: customer.inn,
            customerName: customer.name,
            winnerInn: winner.inn,
            winnerName: winner.name,
            products,
          },
        )
        .run();

      return this.getTenderById(tender.id);
    } catch (error) {
      console.error('Ошибка при создании тендера:', error);
      throw error;
    }
  }

  async updateTender(id: string, input: any): Promise<any> {
    await this.deleteTender(id);
    return this.createTender(input);
  }

  async deleteTender(id: string): Promise<boolean> {
    await this.db
      .match([node('t', 'Tender', { id })])
      .detachDelete('t')
      .run();
    return true;
  }

  async createTendersFromCsvRows(rows: any[]): Promise<void> {
    const prepared = rows.map((row) => ({
      ...row,
      price: parseInt(row.price, 10),
      products: row.productCodes.split(';').map((code, idx) => ({
        code,
        name: row.productNames.split(';')[idx],
      })),
    }));

    await this.db
      .query()
      .raw(
        `
        UNWIND $rows AS row
        CREATE (t:Tender {
          id: row.id,
          title: row.title,
          description: row.description,
          publishDate: date(row.publishDate),
          closeDate: date(row.closeDate),
          price: row.price
        })
        MERGE (c:Customer {inn: row.customerInn})
          ON CREATE SET c.name = row.customerName
        MERGE (w:Winner {inn: row.winnerInn})
          ON CREATE SET w.name = row.winnerName
        MERGE (c)-[:PLACED]->(t)
        MERGE (w)-[:WON]->(t)
        WITH t, row.products AS products
        UNWIND products AS product
          MERGE (p:Product {code: product.code})
          ON CREATE SET p.name = product.name
          MERGE (t)-[:INCLUDES]->(p)
      `,
        { rows: prepared },
      )
      .run();

    console.log(`Inserted ${rows.length} tenders into Neo4j ✅`);
  }
}
function formatNeo4jDate(date: any): string {
  if (!date || typeof date !== 'object') return '';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { year, month, day } = date;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
