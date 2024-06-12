import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { SqsController } from './sqs.controller';
import { SQS } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [
    SqsService,
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
  ],
  controllers: [SqsController],
  exports: [SqsService, SQS],
})
export class SqsModule {}
