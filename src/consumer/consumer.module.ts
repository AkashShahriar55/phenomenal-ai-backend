import { Module } from '@nestjs/common';
import { ProducerModule } from '../producer/producer.module';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SqsModule as AppSqsModule } from '../sqs/sqs.module';
import { ConsumerService } from './consumer/consumer.service';
import { QueueJobsModule } from '../queue-jobs/queue-jobs.module';
import { FilesService } from '../files/files.service';
import { FilesModule } from '../files/files.module';
import { PanelModule } from '../panel/panel.module';
@Module({
  imports: [
    QueueJobsModule,
    SqsModule.registerAsync({
      imports: [ConfigModule], // Import the ConfigModule to use the ConfigService
      useFactory: async (configService: ConfigService) => {
        const accessKeyId =
          configService.get<string>('sqs.accessKeyId', {
            infer: true,
          }) || '';
        const secretAccessKey =
          configService.get<string>('sqs.secretAccessKey', {
            infer: true,
          }) || '';

        // Retrieve the required configuration values using ConfigService
        return {
          consumers: [
            {
              name:
                configService.get<string>('sqs.output_queue_name', {
                  infer: true,
                }) || '', // name of the queue
              queueUrl:
                configService.get<string>('sqs.output_url', {
                  infer: true,
                }) || '', // url of the queue
              region:
                configService.get<string>('sqs.region', {
                  infer: true,
                }) || '', // using the same region for the producer
              batchSize: 10, // number of messages to receive at once
              visibilityTimeout: 10,
              // waitTimeSeconds:300,
              terminateGracefully: true, // gracefully shutdown when SIGINT/SIGTERM is received
              sqs: new SQSClient({
                region:
                  configService.get<string>('sqs.region', {
                    infer: true,
                  }) || '',
                credentials: {
                  accessKeyId: accessKeyId,
                  secretAccessKey: secretAccessKey,
                },
              }),
            },
          ],
          producers: [],
        };
      },
      inject: [ConfigService],
    }),
    AppSqsModule,
    FilesModule,
    PanelModule
  ],
  controllers: [],
  providers: [
    ConsumerService,
  ],
  exports: [ConsumerService],
})
export class ConsumerModule {}
