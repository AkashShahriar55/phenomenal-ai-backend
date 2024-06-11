import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import SQS, { Message } from 'aws-sdk/clients/sqs';
import {
  JOB_TYPES,
  MessageBody,
} from '../../producer/producer/producer.service';
import { QueueJobsService } from '../../queue-jobs/queue-jobs.service';
import { ConfigService } from '@nestjs/config';
import { FileType } from '../../files/domain/file';
import { FilesService } from '../../files/files.service';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly queueJobsService: QueueJobsService,
    private readonly configService: ConfigService,
    private readonly sqs:SQS,
    private readonly filesService:FilesService
  ) {}

  private readonly logger = new Logger(ConsumerService.name);

  @SqsMessageHandler(/** name: */ 'prompt_output.fifo', /** batch: */ false)
  async handleMessage(message: Message) {
    const msgBody: MessageBody = JSON.parse(message.Body!) as MessageBody;
    console.log('Consumer  Start ....:', message);

    // if (!JOB_TYPES.includes(msgBody.MessageAttributes.job.value)) {

    //   Logger.error('Invalid job type ' + msgBody.MessageAttributes.job.value);
    //   throw new InternalServerErrorException(
    //     'Invalid job type ' + msgBody.MessageAttributes.job.value,
    //   );
    // }

    try {
      //Todo
      // handle the message here
      const body = JSON.parse(message.Body!)
      const job = await this.queueJobsService.findJobByMessageId(body.jobID)
      if(body.status === "success"){
        if(job){
          const response = await this.filesService.createInternalS3File(job.message_id+".mp4")
          job.output = response.file
          job.status = 1
          const updateResponse = await this.queueJobsService.updateJob(job.id,job)
        }
      }else if(body.status === "failed"){
        if(job){
          job.status = 2
          const deleteResponse = await this.queueJobsService.updateJob(job?.id,job)
        }
   
      }
      


    } catch (error) {
      console.log('consumer error', JSON.stringify(error));
      //keep the message in sqs
      Logger.error(error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteMessage(receiptHandle: string) {
    try {
      const queueUrl = this.configService.get<string>('sqs.output_queue_name')!;
      
      await this.sqs.deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message', error);
    }
  }
}
