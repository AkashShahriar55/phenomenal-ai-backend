import { Module } from '@nestjs/common';
import { PanelService } from './panel/panel.service';
import { PanelGateway } from './panel.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ProducerModule } from '../producer/producer.module';
import { UsersModule } from '../users/users.module';
import { QueueJobsModule } from '../queue-jobs/queue-jobs.module';

@Module({
  imports: [
    JwtModule.register({}),
    ProducerModule,
    UsersModule,
    QueueJobsModule,
  ],
  providers: [PanelService, PanelGateway],
  exports: [PanelService, PanelGateway],
})
export class PanelModule {}
