import { User } from '../../../users/domain/user';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { QueueJob } from '../../domain/queue-job';

export abstract class QueueJobRepository {
  abstract create(
    data: Omit<
      QueueJob,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'status' | 'counter'
    >,
  ): Promise<QueueJob>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<QueueJob[]>;

  abstract findById(id: QueueJob['id']): Promise<NullableType<QueueJob>>;

  abstract findByMessageId(
    mssage_id: QueueJob['message_id'],
  ): Promise<NullableType<QueueJob>>;

  abstract findByUser(conditions: {
    userId: User['id'];
  }): Promise<NullableType<QueueJob>>;

  abstract update(
    id: QueueJob['id'],
    payload: DeepPartial<QueueJob>,
  ): Promise<QueueJob | null>;

  abstract remove(id: QueueJob['id']): Promise<void>;

  abstract findLastQueuedJob({
    userId,
  }: {
    userId: User['id'];
  }): Promise<NullableType<QueueJob>>;
}
