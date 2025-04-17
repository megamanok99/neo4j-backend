import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'cypher-query-builder';

@Injectable()
export class ConstraintService implements OnModuleInit {
  constructor(@Inject('NEO4J') private readonly db: Connection) {}

  async onModuleInit() {
    await this.createTenderIdConstraint();
  }

  private async createTenderIdConstraint() {
    await this.db
      .raw(
        `
      CREATE CONSTRAINT tender_id_unique IF NOT EXISTS
      FOR (t:Tender)
      REQUIRE t.id IS UNIQUE
    `,
      )
      .run();
    console.log(
      '✅ Unique constraint on Tender.id created (or already exists)',
    );
  }
}
