import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from 'aws-sdk/clients/sqs';
import {
  JOB_TYPES,
  MessageBody,
} from '../../producer/producer/producer.service';
import { QueueJobService } from '../../producer/queuejob.service';

@Injectable()
export class ConsumerService {
  constructor(private readonly queueJobService: QueueJobService) {}

  @SqsMessageHandler(/** name: */ 'prompt_output.fifo', /** batch: */ false)
  async handleMessage(message: Message) {
    const msgBody: MessageBody = JSON.parse(message.Body!) as MessageBody;
    console.log('Consumer  Start ....:', msgBody.messageId);

    if (!JOB_TYPES.includes(msgBody.MessageAttributes.job.value)) {
      Logger.error('Invalid job type ' + msgBody.MessageAttributes.job.value);
      throw new InternalServerErrorException(
        'Invalid job type ' + msgBody.MessageAttributes.job.value,
      );
    }

    try {
      //Todo
      // handle the message here
    } catch (error) {
      console.log('consumer error', JSON.stringify(error));
      //keep the message in sqs
      Logger.error(error.message);
      throw new InternalServerErrorException(error);
    }
  }
}
