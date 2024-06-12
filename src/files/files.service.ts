import { Injectable } from '@nestjs/common';

import { FileRepository } from './infrastructure/persistence/file.repository';
import { FileType } from './domain/file';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  findById(id: FileType['id']): Promise<NullableType<FileType>> {
    return this.fileRepository.findById(id);
  }

  async createInternalS3File(key: string): Promise<{ file: FileType }> {
    const data = await this.fileRepository.create({
      path: key,
    });

    return {
      file: data,
    };
  }
}
