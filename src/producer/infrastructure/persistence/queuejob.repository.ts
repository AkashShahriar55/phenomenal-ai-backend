import { QueueJobClass } from './document/entities/queuejob.schema';

export abstract class QueueJobRepository {
  abstract create(data: Partial<QueueJobClass>): Promise<QueueJobClass>;
}
