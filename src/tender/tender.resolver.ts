import { Query, Resolver } from '@nestjs/graphql';

import { Tender } from 'src/models/tender.model';
import { TenderService } from './tender.service';
@Resolver(Tender)
export class TenderResolver {
  constructor(private readonly tenderService: TenderService) {}

  @Query(() => [Tender])
  async tenders() {
    return this.tenderService.getAllTenders();
  }
}
