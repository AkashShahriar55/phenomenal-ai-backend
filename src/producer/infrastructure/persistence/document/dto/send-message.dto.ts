import { IsNotEmpty } from 'class-validator';

export class SendGenerateMessage {
  @IsNotEmpty()
  prompt: string;

  @IsNotEmpty()
  duration: number;
}
