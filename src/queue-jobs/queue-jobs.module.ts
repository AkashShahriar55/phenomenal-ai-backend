import { Module } from '@nestjs/common';
import { QueueJobsService } from './queue-jobs.service';
import { DocumentQueueJobPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [DocumentQueueJobPersistenceModule],
  providers: [QueueJobsService],
  exports: [QueueJobsService, DocumentQueueJobPersistenceModule],
})
export class QueueJobsModule {}
