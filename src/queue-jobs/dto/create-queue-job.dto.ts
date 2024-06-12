// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateQueueJobDto {
  @ApiProperty({ example: 'A deer running into the jungle.', type: String })
  @IsNotEmpty()
  @MaxLength(300)
  prompt: string | null;

  @ApiProperty()
  @IsNotEmpty()
  duration: number | null;
}
