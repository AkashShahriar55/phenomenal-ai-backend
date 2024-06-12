import { Controller, UseGuards } from '@nestjs/common';
import { QueueJobsService } from './queue-jobs.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Queuejobs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'queue-jobs',
  version: '1',
})
export class QueueJobsController {
  constructor(private readonly service: QueueJobsService) {}
}
