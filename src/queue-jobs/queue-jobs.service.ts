import { Injectable } from '@nestjs/common';
import { QueueJobRepository } from './infrastructure/persistence/queue-job.repository';
import { EnqueueJobDto } from './dto/enqueue-job.dto';
import { QueueJob } from './domain/queue-job';

@Injectable()
export class QueueJobsService {
  constructor(private readonly queue_jobRepository: QueueJobRepository) {}
  
  
  async enqueueJob(
    queueDto: EnqueueJobDto
  ): Promise<QueueJob> {
    console.log(queueDto)
    return this.queue_jobRepository.create(queueDto)
  }
}
