import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export class EnqueueJobDto {
  user:User;
  message_id: string;
  message: any;
  entity: any;
  queue: string;
  job_type: string;
  status?: number;
  counter?: number;
  error?: any;
}
