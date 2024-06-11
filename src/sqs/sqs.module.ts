import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { SqsController } from './sqs.controller';
import { ProducerModule } from '../producer/producer.module';

@Module({
  imports: [ProducerModule],
  providers: [SqsService],
  controllers: [SqsController],
})
export class SqsModule {}
