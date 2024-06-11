import { Module } from '@nestjs/common';
import { PanelService } from './panel/panel.service';
import { PanelGateway } from './panel.gateway';
import { WsJwtGuard } from './strategies/ws-jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { ProducerModule } from '../producer/producer.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[
    JwtModule.register({}),
    ProducerModule,
    UsersModule
  ],
  providers: [PanelService,PanelGateway]
})
export class PanelModule {}
