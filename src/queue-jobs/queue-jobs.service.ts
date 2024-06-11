import { Injectable } from '@nestjs/common';
import { QueueJobRepository } from './infrastructure/persistence/queue-job.repository';
import { EnqueueJobDto } from './dto/enqueue-job.dto';
import { QueueJob } from './domain/queue-job';
import { NullableType } from '../utils/types/nullable.type';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { User } from '../users/domain/user';

@Injectable()
export class QueueJobsService {
  constructor(private readonly queue_jobRepository: QueueJobRepository) {}
  
  
  async enqueueJob(
    queueDto: EnqueueJobDto
  ): Promise<QueueJob> {
    console.log(queueDto)
    return this.queue_jobRepository.create(queueDto)
  }

  async deleteJob(
    id: QueueJob['id']
  ): Promise<void> {
    return this.queue_jobRepository.remove(id)
  }

  async findJobByMessageId(
    message_id: QueueJob['message_id']
  ): Promise<NullableType<QueueJob>> {
    return this.queue_jobRepository.findByMessageId(message_id)
  }

  async findJobByUser(
    conditions: { userId: User['id'] }
  ): Promise<NullableType<QueueJob>> {
    return this.queue_jobRepository.findByUser(conditions)
  }

  async updateJob(
    id:QueueJob['id'],
    queueJob: DeepPartial<QueueJob>
  ): Promise<NullableType<QueueJob>> {
    return this.queue_jobRepository.update(id,queueJob)
  }


  async findLastUnfinishedQueuedJob(
    conditions: { userId: User['id'] }
  ): Promise<NullableType<QueueJob>> {
    return this.queue_jobRepository.findLastUnfinishedQueuedJob(conditions)
  }

}
