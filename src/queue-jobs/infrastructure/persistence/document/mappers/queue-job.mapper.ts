import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { FileMapper } from '../../../../../files/infrastructure/persistence/document/mappers/file.mapper';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';
import { QueueJob } from '../../../../domain/queue-job';
import { QueueJobSchemaClass } from '../entities/queue-job.schema';

export class QueueJobMapper {
  public static toDomain(raw: QueueJobSchemaClass): QueueJob {
    // console.log("domain")
    // console.log(raw)
    const domainEntity = new QueueJob();
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }
    if (raw.output) {
      domainEntity.output = FileMapper.toDomain(raw.output);
    } else if (raw.output === null) {
      domainEntity.output = null;
    }
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
    // console.log("toPersistence")
    // console.log(domainEntity)
    const user = new UserSchemaClass();
    user._id = domainEntity.user.id.toString();
    const persistenceSchema = new QueueJobSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }

    let output: FileSchemaClass | undefined = undefined;

    if (domainEntity.output) {
      output = new FileSchemaClass();
      output._id = domainEntity.output.id;
      output.path = domainEntity.output.path;
    }
    persistenceSchema.user = user;
    persistenceSchema.entity = domainEntity.entity;
    persistenceSchema.error = domainEntity.error;
    persistenceSchema.output = output;
    persistenceSchema.message = domainEntity.job_type;
    persistenceSchema.message_id = domainEntity.message_id;
    if (domainEntity.status) {
      persistenceSchema.status = domainEntity.status;
    }
    if (domainEntity.counter) {
      persistenceSchema.counter = domainEntity.counter;
    }
    persistenceSchema.queue = domainEntity.queue;
    persistenceSchema.job_type = domainEntity.job_type;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
