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
    function formatNeo4jDate(date: any): string {
      if (!date || typeof date !== 'object') return '';
      const { year, month, day } = date;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return res.map((tender) => ({
      ...tender,
      publishDate: formatNeo4jDate(tender.publishDate),
      closeDate: formatNeo4jDate(tender.closeDate),
    }));
  }
}
