import { Injectable, Logger } from '@nestjs/common';
import { ProducerService } from '../../producer/producer/producer.service';
import { UsersService } from '../../users/users.service';
import { QueueJobsService } from '../../queue-jobs/queue-jobs.service';
import { User } from '../../users/domain/user';
import { WsResponse } from '@nestjs/websockets';
import { SocketWithAuth } from '../types';
import { GenerationResponse, GenerationStatus } from '../domain/socket-response';
import { RequestGeneration } from '../dto/request-generate.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PanelService {
    constructor(
        private readonly producerService: ProducerService,
        private readonly usersService: UsersService,
        private readonly queueJobsService: QueueJobsService
    ) { }

    private readonly logger = new Logger(PanelService.name);

    //// look up for generation task

    async lookForGenerationTask(
        client: SocketWithAuth,
    ):Promise<WsResponse<GenerationStatus>> {
        const queuedJob = await this.queueJobsService.findLastUnfinishedQueuedJob({ userId: client.user.id.toString() })
        console.log(queuedJob);
        if (queuedJob && queuedJob.status === 0) {
            return {
                event: "lookupGeneration",
                data: {status:"Generating"},
            }
        } else {
            return {
                event: "lookupGeneration",
                data: {status:"Generated"},
            }
        }
    }




    //// request generate task 

    async requestGenerateTask(
        request: RequestGeneration,
        client: SocketWithAuth,
    ):Promise<WsResponse<GenerationResponse>>{
        const user = await this.usersService.findById(client.user.id)
        if(user){
            const res = await lastValueFrom(this.producerService.send(
                user,
                request,
                "generate"
              ))
            if(res.$response.error){
                return {
                    event: "generate",
                    data: {messageId:null},
                }
            }
            return {
                event: "generate",
                data: {messageId:res.MessageId},
            }
        }else{
            return {
                event: "generate",
                data: {messageId:null},
            }
        }
        
    }

}
