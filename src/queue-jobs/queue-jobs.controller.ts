import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { QueueJobsService } from './queue-jobs.service';
import { CreateQueueJobDto } from './dto/create-queue-job.dto';
import { UpdateQueueJobDto } from './dto/update-queue-job.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueueJob } from './domain/queue-job';
import { AuthGuard } from '@nestjs/passport';
import { EnqueueJobDto } from './dto/enqueue-job.dto';

@ApiTags('Queuejobs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'queue-jobs',
  version: '1',
})
export class QueueJobsController {
  constructor(
    private readonly service: QueueJobsService
  ) {}
  


}
