import { Module } from '@nestjs/common';

import { ProducerService } from './producer/producer.service';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';
import { QueueJobsModule } from '../queue-jobs/queue-jobs.module';


@Module({
  imports: [QueueJobsModule],
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
  ],
  exports: [
    SQS,
    ProducerService,
  ],
})
export class ProducerModule {}
