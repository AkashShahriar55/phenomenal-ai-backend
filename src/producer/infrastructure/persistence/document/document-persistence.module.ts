import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueJobSchema, QueueJobClass } from './entities/queuejob.schema';
import { QueueJobRepository } from '../queuejob.repository';
import { QueueJobDocumentRepository } from './repositories/queuejob.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QueueJobClass.name, schema: QueueJobSchema },
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
