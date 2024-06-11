import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class QueueJob {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  user_id: string;

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
