// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateQueueJobDto } from './create-queue-job.dto';
import { FileDto } from '../../files/dto/file.dto';
import { IsOptional } from 'class-validator';

export class UpdateQueueJobDto extends PartialType(CreateQueueJobDto) {
  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  output?: FileDto | null;
}
