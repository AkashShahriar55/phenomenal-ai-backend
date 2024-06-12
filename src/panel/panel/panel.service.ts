import { Injectable, Logger } from '@nestjs/common';
import { ProducerService } from '../../producer/producer/producer.service';
import { UsersService } from '../../users/users.service';
import { QueueJobsService } from '../../queue-jobs/queue-jobs.service';
import { WsException, WsResponse } from '@nestjs/websockets';
import { SocketWithAuth } from '../types';
import { GenerationResponse } from '../domain/socket-response';
import { RequestGeneration } from '../dto/request-generate.dto';
import { lastValueFrom } from 'rxjs';
import { getS3SignedUrl } from '../../utils/get-s3-signed-url';

@Injectable()
export class PanelService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly usersService: UsersService,
    private readonly queueJobsService: QueueJobsService,
  ) {}

  private readonly logger = new Logger(PanelService.name);

  //// look up for generation task

  async lookForGenerationTask(
    client: SocketWithAuth,
  ): Promise<WsResponse<GenerationResponse>> {
    const queuedJob = await this.queueJobsService.findLastQueuedJob({
      userId: client.user.id.toString(),
    });

    if (queuedJob) {
      if (queuedJob.status === 1 && queuedJob?.output?.path) {
        const path = await getS3SignedUrl(queuedJob?.output?.path);
        return {
          event: 'generate',
          data: {
            jobID: queuedJob.message_id,
            status: 'Generated',
            output: {
              outputPath: path,
              prompt: queuedJob.entity.prompt,
              duration: queuedJob.entity.duration,
            },
          },
        };
      } else if (queuedJob.status === 0) {
        return {
          event: 'generate',
          data: {
            jobID: queuedJob.message_id,
            status: 'Generating',
            output: {
              prompt: queuedJob.entity.prompt,
              duration: queuedJob.entity.duration,
            },
          },
        };
      } else {
        return {
          event: 'generate',
          data: {
            jobID: queuedJob.message_id,
            status: 'Failed',
          },
        };
      }
    } else {
      throw new WsException('no job found');
    }
  }

  //// request generate task

  async requestGenerateTask(
    request: RequestGeneration,
    client: SocketWithAuth,
  ): Promise<WsResponse<GenerationResponse>> {
    const user = await this.usersService.findById(client.user.id);
    console.log(user);
    if (user) {
      const res = await lastValueFrom(
        this.producerService.send(user, request, 'generate'),
      );
      if (res.$response.error) {
        throw new WsException(res.$response.error.message);
      }
      return {
        event: 'generate',
        data: {
          jobID: '',
          status: 'Generating',
        },
      };
    } else {
      throw new WsException('User not found');
    }
  }
}
