import { ApiResponseProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

const idType = String;

export class Role {
  @Allow()
  @ApiResponseProperty({
    type: idType,
  })
  id: number | string;

  @Allow()
  @ApiResponseProperty({
    type: String,
    example: 'admin',
  })
  name?: string;
}
