import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QueueJobSchema,
  QueueJobSchemaClass,
} from './entities/queue-job.schema';
import { QueueJobRepository } from '../queue-job.repository';
import { QueueJobDocumentRepository } from './repositories/queue-job.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QueueJobSchemaClass.name, schema: QueueJobSchema },
    ]),
  ],
  providers: [
    {
      provide: QueueJobRepository,
      useClass: QueueJobDocumentRepository,
    },
  ],
  exports: [QueueJobRepository],
})
export class DocumentQueueJobPersistenceModule {}
