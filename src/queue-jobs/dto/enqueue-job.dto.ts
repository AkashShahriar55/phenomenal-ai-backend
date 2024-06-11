import { ApiResponseProperty } from '@nestjs/swagger';

export class EnqueueJobDto {
  user_id:string;
  message_id: string;
  message: any;
  entity: any;
  queue: string;
  job_type: string;
  status?: number;
  counter?: number;
  error?: any;
}
