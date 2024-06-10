import { Injectable } from '@nestjs/common';

import { QueueJobRepository } from './infrastructure/persistence/queuejob.repository';
import { QueueJobClass } from './infrastructure/persistence/document/entities/queuejob.schema';

@Injectable()
export class QueueJobService {
  constructor(private readonly queueJobRepository: QueueJobRepository) {}

  async create(data: Partial<QueueJobClass>): Promise<QueueJobClass> {
    return this.queueJobRepository.create(data);
  }
}
