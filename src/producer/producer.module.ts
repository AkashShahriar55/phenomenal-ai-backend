import { Module } from '@nestjs/common';

import { ProducerService } from './producer/producer.service';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';
import { QueueJobsModule } from '../queue-jobs/queue-jobs.module';
import { SqsModule } from '../sqs/sqs.module';


@Module({
  imports: [QueueJobsModule,SqsModule],
  providers: [
    ProducerService,
  ],
  exports: [
    ProducerService,
  ],
})
export class ProducerModule {}
