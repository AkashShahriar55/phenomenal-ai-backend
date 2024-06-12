import { ApiResponseProperty } from '@nestjs/swagger';
import { FileType } from '../../files/domain/file';
import { User } from '../../users/domain/user';

export class QueueJob {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  user: User;

  @ApiResponseProperty()
  message_id: string;

  @ApiResponseProperty()
  message: any;

  @ApiResponseProperty()
  entity: any;

  @ApiResponseProperty()
  queue: string;

  @ApiResponseProperty()
  job_type: string;

  @ApiResponseProperty()
  status?: number;

  @ApiResponseProperty({
    type: () => FileType,
  })
  output?: FileType | null;

  @ApiResponseProperty()
  counter?: number;

  @ApiResponseProperty()
  error?: any;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  deletedAt: Date;
}
