import { Injectable } from '@nestjs/common';
import csvParser from 'csv-parser';
import Upload from 'graphql-upload/Upload.mjs';
import { TenderService } from './tender.service'; // путь подкорректируй под себя

@Injectable()
export class TenderUploadService {
  constructor(private readonly tenderService: TenderService) {}

  async uploadFile(
    file: Upload,
  ): Promise<{ success: boolean; message: string }> {
    const { createReadStream, filename } = await file.promise;

    return new Promise((resolve, reject) => {
      const tenders: any[] = [];

      createReadStream()
        .pipe(csvParser())
        .on('data', (row) => tenders.push(row))
        .on('end', async () => {
          try {
            console.log('Parsed tenders:', tenders);
            await this.tenderService.createTendersFromCsvRows(tenders);
            resolve({
              success: true,
              message: `File ${filename} parsed and tenders saved successfully`,
            });
          } catch (error) {
            console.error('Error saving tenders:', error);
            reject({
              success: false,
              message: 'Failed to save tenders to database',
            });
          }
        })
        .on('error', (error) => {
          console.error('Error parsing file:', error);
          reject({
            success: false,
            message: `Error parsing file: ${error.message}`,
          });
        });
    });
  }
}
