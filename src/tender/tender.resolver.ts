import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import Upload from 'graphql-upload/Upload.mjs';
import { Tender, TenderInput } from 'src/models/tender.model';
import { UploadResponse } from 'src/models/upload-response.model';
import { TenderService } from './tender.service';
import { TenderUploadService } from './tender.upload';
@Resolver(Tender)
export class TenderResolver {
  constructor(
    private readonly tenderService: TenderService,
    private readonly tenderUploadService: TenderUploadService,
  ) {}

  @Query(() => [Tender])
  async tenders() {
    return this.tenderService.getAllTenders();
  }
  @Query(() => Tender, { nullable: true })
  tender(@Args('id') id: string): Promise<any> {
    return this.tenderService.getTenderById(id);
  }

  @Mutation(() => Tender)
  async createTender(@Args('input') input: TenderInput): Promise<Tender> {
    return this.tenderService.createTender(input);
  }

  @Mutation(() => Tender)
  async updateTender(
    @Args('id') id: string,
    @Args('input') input: TenderInput,
  ): Promise<Tender> {
    return this.tenderService.updateTender(id, input);
  }

  @Mutation(() => Boolean)
  async deleteTender(@Args('id') id: string): Promise<boolean> {
    return this.tenderService.deleteTender(id);
  }

  @Mutation(() => UploadResponse)
  uploadTenders(
    @Args({ name: 'file', type: () => Upload })
    file: Upload,
  ): Promise<UploadResponse> {
    console.log(`here`, file);
    return this.tenderUploadService.uploadFile(file);
  }
}
