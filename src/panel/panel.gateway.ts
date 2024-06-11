import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PanelService } from './panel/panel.service';
import { AuthGuard } from '@nestjs/passport';
import { WsJwtGuard } from './strategies/ws-jwt.guard';
import {  ProducerService } from '../producer/producer/producer.service';
import { SendGenerateMessage } from '../producer/infrastructure/persistence/document/dto/send-message.dto';
import { SocketWithAuth } from './types';
import { UsersService } from '../users/users.service';
import { use } from 'passport';
import { QueueJobsService } from '../queue-jobs/queue-jobs.service';
import { RequestGeneration } from './dto/request-generate.dto';




@WebSocketGateway({
  namespace:"panel",
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

export class PanelGateway implements OnGatewayInit,OnGatewayConnection,OnGatewayDisconnect {

  constructor(
    private readonly panelService: PanelService,
    private readonly producerService: ProducerService,
    private readonly usersService:UsersService,
    private readonly queueJobsService:QueueJobsService
  ) {}

  private readonly logger = new Logger(PanelGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log("Initialized");
  }

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
  ){
    return await this.panelService.lookForGenerationTask(client)
  }


 
  @UseGuards(WsJwtGuard)
  @SubscribeMessage("generate")
  async handleGenerateMessage(
    @MessageBody() request: RequestGeneration,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    return await this.panelService.requestGenerateTask(request,client)
  }

}
