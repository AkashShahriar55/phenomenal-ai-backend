import { Get, HttpCode, HttpStatus, Logger, SerializeOptions, UseFilters, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PanelService } from './panel/panel.service';
import { AuthGuard } from '@nestjs/passport';
import { WsJwtGuard } from './strategies/ws-jwt.guard';
import { ProducerService } from '../producer/producer/producer.service';
import { SendGenerateMessage } from '../producer/infrastructure/persistence/document/dto/send-message.dto';
import { SocketWithAuth } from './types';
import { UsersService } from '../users/users.service';
import { use } from 'passport';
import { QueueJobsService } from '../queue-jobs/queue-jobs.service';
import { RequestGeneration } from './dto/request-generate.dto';
import { FileType } from '../files/domain/file';
import { WsExceptionFilter } from '../utils/filters/ws-exception-filter';
import { GenerationResponse } from './domain/socket-response';
import { getS3SignedUrl } from '../utils/get-s3-signed-url';
import { QueueJob } from '../queue-jobs/domain/queue-job';
import { SocketError } from './dto/socket-error.dto';




@WebSocketGateway({
  namespace: "panel",
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
@UseFilters(new WsExceptionFilter())
export class PanelGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly panelService: PanelService,
    private readonly producerService: ProducerService,
    private readonly usersService: UsersService,
    private readonly queueJobsService: QueueJobsService
  ) { }

  private readonly logger = new Logger(PanelGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log("Initialized");
  }


  @UseGuards(WsJwtGuard)
  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${this.io.sockets}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client id:${client.id} disconnected`);
  }


  @UseGuards(WsJwtGuard)
  @SubscribeMessage("lookupGeneration")
  async handleLookUpMessage(
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<WsResponse<GenerationResponse>> {
    return await this.panelService.lookForGenerationTask(client)
  }



  @UseGuards(WsJwtGuard)
  @SubscribeMessage("generate")
  async handleGenerateMessage(
    @MessageBody() request: RequestGeneration,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    return await this.panelService.requestGenerateTask(request, client)
  }


  // Custom method to emit data
  async emitOutput(job: QueueJob): Promise<void> {
    if (job.output?.path) {
      const signedPath = await getS3SignedUrl(job.output?.path)
      const data = {
        jobID: job.message_id,
        status: "Generated",
        output: {
          outputPath: signedPath,
          prompt: job.entity.prompt,
          duration: job.entity.duration
        }
      } as GenerationResponse
      this.io.emit(
        "generate",
        data
      );
    }else{
      this.io.emit(
        "error",
        {
          reason:"NoOutput",
          message:"no output found"
        } as SocketError
      );
    }
  }


}
