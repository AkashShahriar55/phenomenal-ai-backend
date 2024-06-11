import { QueueJob } from '../../../../domain/queue-job';
import { QueueJobSchemaClass } from '../entities/queue-job.schema';

export class QueueJobMapper {
  public static toDomain(raw: QueueJobSchemaClass): QueueJob {
    const domainEntity = new QueueJob();
    domainEntity.id = raw._id.toString();
    domainEntity.counter = raw.counter;
    domainEntity.entity = raw.entity;
    domainEntity.error = raw.error;
    domainEntity.message = raw.job_type;
    domainEntity.message_id = raw.message_id;
    domainEntity.queue = raw.queue;
    domainEntity.status = raw.status;
    domainEntity.job_type = raw.job_type;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: QueueJob): QueueJobSchemaClass {
    const persistenceSchema = new QueueJobSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.user_id = domainEntity.user_id;
    persistenceSchema.entity = domainEntity.entity;
    persistenceSchema.error = domainEntity.error;
    persistenceSchema.message = domainEntity.job_type;
    persistenceSchema.message_id = domainEntity.message_id;
    persistenceSchema.queue = domainEntity.queue;
    persistenceSchema.job_type = domainEntity.job_type;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
