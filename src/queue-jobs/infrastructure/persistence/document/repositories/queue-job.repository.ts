import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueueJobSchemaClass } from '../entities/queue-job.schema';
import { QueueJobRepository } from '../../queue-job.repository';
import { QueueJob } from '../../../../domain/queue-job';
import { QueueJobMapper } from '../mappers/queue-job.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { User } from '../../../../../users/domain/user';

@Injectable()
export class QueueJobDocumentRepository implements QueueJobRepository {
  constructor(
    @InjectModel(QueueJobSchemaClass.name)
    private readonly queue_jobModel: Model<QueueJobSchemaClass>,
  ) {}

  async create(data: QueueJob): Promise<QueueJob> {
    const persistenceModel = QueueJobMapper.toPersistence(data);
    const createdEntity = new this.queue_jobModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return QueueJobMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<QueueJob[]> {
    const entityObjects = await this.queue_jobModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      QueueJobMapper.toDomain(entityObject),
    );
  }

  async findById(id: QueueJob['id']): Promise<NullableType<QueueJob>> {
    const entityObject = await this.queue_jobModel.findById(id);
    return entityObject ? QueueJobMapper.toDomain(entityObject) : null;
  }

  async findByMessageId(message_id: QueueJob['message_id']): Promise<NullableType<QueueJob>> {
    const entityObject = await this.queue_jobModel.findOne({message_id:message_id});
    return entityObject ? QueueJobMapper.toDomain(entityObject) : null;
  }

  async update(
    id: QueueJob['id'],
    payload: Partial<QueueJob>,
  ): Promise<NullableType<QueueJob>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.queue_jobModel.findOne(filter);

   
    if (!entity) {
      throw new Error('Record not found');
    }
    console.log("reached here " + entity)
    const entityObject = await this.queue_jobModel.findOneAndUpdate(
      filter,
      QueueJobMapper.toPersistence({
        ...QueueJobMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );
    return entityObject ? QueueJobMapper.toDomain(entityObject) : null;
  }

  async findByUser({ userId }: { userId: User['id'] }): Promise<NullableType<QueueJob>>{
    const entityObject = await this.queue_jobModel.findOne({user:userId});
    return entityObject ? QueueJobMapper.toDomain(entityObject) : null;
  };

  async remove(id: QueueJob['id']): Promise<void> {
    await this.queue_jobModel.deleteOne({ _id: id });
  }


  async findLastQueuedJob(
    { userId }: { userId: User['id'] }
  ): Promise<NullableType<QueueJob>> {
    const entityObject = await this.queue_jobModel.findOne({ user: userId })
      .sort({ updatedAt: -1 })
      .exec();
    return entityObject ? QueueJobMapper.toDomain(entityObject) : null;
  }
}
