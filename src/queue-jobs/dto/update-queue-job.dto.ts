// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateQueueJobDto } from './create-queue-job.dto';

export class UpdateQueueJobDto extends PartialType(CreateQueueJobDto) {}
