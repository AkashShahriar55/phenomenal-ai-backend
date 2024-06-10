import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueJobService } from '../queuejob.service';
import { v4 as uuidv4 } from 'uuid';
import { SQS } from 'aws-sdk';
import { QueueJobClass } from '../infrastructure/persistence/document/entities/queuejob.schema';
import { catchError, defer, from, switchMap, tap } from 'rxjs';

export interface SQSMessage {
  QueueUrl: string;
  MessageBody: string;
  MessageGroupId?: string;
  MessageDeduplicationId?: string;
  DelaySeconds?: number;
}

export interface Job {
  DataType: string;
  value: string;
}
export interface MessageAttributes {
  job: Job;
}

export interface MessageBody {
  messageId: string;
  message: any;
  date: string;
  MessageAttributes: MessageAttributes;
}

export const JOB_TYPES = [''];

@Injectable()
export class ProducerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly queueJobService: QueueJobService,
  ) {}

  send(message: any, jobType: string, messageGroupId: string = 'general') {
    if (!JOB_TYPES.includes(jobType)) {
      throw new BadRequestException('Invalid job type');
    }
    const region = this.configService.get<string>('sqs.region', {
      infer: true,
    });
    const accessKeyId = this.configService.get<string>('sqs.accessKeyId', {
      infer: true,
    });
    const secretAccessKey = this.configService.get<string>(
      'sqs.secretAccessKey',
      {
        infer: true,
      },
    );
    const isFifo: boolean = JSON.parse(
      this.configService.get('sqs.isFifo', {
        infer: true,
      })!,
    );

    const messageId = uuidv4();
    let sqsMessage: SQSMessage = {
      QueueUrl: this.configService.get<string>('sqs.input_url', {
        infer: true,
      })!,
      MessageBody: JSON.stringify({
        messageId,
        message,
        MessageAttributes: {
          job: {
            DataType: 'string',
            value: jobType,
          },
        },
      } as MessageBody),
    };
    if (isFifo == true) {
      sqsMessage = {
        ...sqsMessage,
        MessageGroupId: messageGroupId,
        MessageDeduplicationId: messageId,
      };
    }
    const sqs = new SQS({
      region,
      accessKeyId,
      secretAccessKey,
    });
    console.log('sqsMessage:', sqsMessage);

    const input: Partial<QueueJobClass> = {
      message_id: messageId,
      message: sqsMessage,
      entity: message,
      job_type: jobType,
      queue: this.configService.get<string>('sqs.input_queue_name', {
        infer: true,
      }),
    };

    return defer(() => this.queueJobService.create(input)).pipe(
      switchMap(() => {
        return from(sqs.sendMessage(sqsMessage).promise()).pipe(
          tap(() => {
            return true;
          }),
          catchError((error) => {
            throw new InternalServerErrorException(error);
          }),
        );
      }),
    );
  }
}
