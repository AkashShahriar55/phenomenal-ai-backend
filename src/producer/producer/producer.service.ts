import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { SQS } from 'aws-sdk';
import { catchError, defer, from, switchMap, tap } from 'rxjs';
import { UUID } from 'crypto';
import { SendGenerateMessage } from '../infrastructure/persistence/document/dto/send-message.dto';
import { QueueJobsService } from '../../queue-jobs/queue-jobs.service';
import { EnqueueJobDto } from '../../queue-jobs/dto/enqueue-job.dto';

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
  prompt: string;
  duration:number;
  date: string;
  MessageAttributes: MessageAttributes;
}

export const JOB_TYPES = ['generate'];

@Injectable()
export class ProducerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly queueJobsService: QueueJobsService,
  ) {}

  send(userId:string , message: SendGenerateMessage, jobType: string, messageGroupId: string = 'general') {
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

    const jobId = uuidv4();
    const prompt = message.prompt;
    const duration = message.duration;
    console.log(`${message} ${message.duration} ${message.prompt}`);
    let sqsMessage: SQSMessage = {
      QueueUrl: this.configService.get<string>('sqs.input_url', {
        infer: true,
      })!,
      MessageBody: JSON.stringify({
        jobId:jobId,
        prompt:prompt,
        duration:duration
      }),
    };
    console.log('sqsMessage:', sqsMessage);
    if (isFifo == true) {
      sqsMessage = {
        ...sqsMessage,
        MessageGroupId: messageGroupId,
        MessageDeduplicationId: jobId,
      };
    }
    const sqs = new SQS({
      region,
      accessKeyId,
      secretAccessKey,
    });
  

    const input: EnqueueJobDto = {
      user_id:userId,
      message_id: jobId,
      message: sqsMessage,
      entity: message,
      job_type: jobType,
      queue: this.configService.get<string>('sqs.input_queue_name', {
        infer: true,
      }) || "unknown"
    };


  

    return defer(() => this.queueJobsService.enqueueJob(input)).pipe(
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
