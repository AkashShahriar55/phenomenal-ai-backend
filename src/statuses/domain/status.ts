import { ApiResponseProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

const idType = String;

export class Status {
  @Allow()
  @ApiResponseProperty({
    type: idType,
  })
  id: number | string;

  @Allow()
  @ApiResponseProperty({
    type: String,
    example: 'active',
  })
  name?: string;
}
