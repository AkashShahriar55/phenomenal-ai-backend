import { Module } from '@nestjs/common';

import { ProducerService } from './producer/producer.service';
import { DocumentQueueJobPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { ConfigService } from '@nestjs/config';
import { QueueJobService } from './queuejob.service';
import { SQS } from 'aws-sdk';

const infrastructurePersistenceModule = DocumentQueueJobPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  providers: [
    {
      provide: SQS, // Provide the SQS service from the AWS SDK
      useFactory: (configService: ConfigService) => {
        const region = configService.get<string>('sqs.region', {
          infer: true,
        });
        const accessKeyId = configService.get<string>('sqs.accessKeyId', {
          infer: true,
        });
        const secretAccessKey = configService.get<string>(
          'sqs.secretAccessKey',
          {
            infer: true,
          },
        );
        const sqsConfig = {
          region,
          accessKeyId,
          secretAccessKey,
        };
        return new SQS(sqsConfig);
      },
      inject: [ConfigService],
    },
    ProducerService,
    QueueJobService,
  ],
  exports: [
    SQS,
    ProducerService,
    QueueJobService,
    infrastructurePersistenceModule,
  ],
})
export class ProducerModule {}
