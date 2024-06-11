import { registerAs } from '@nestjs/config';

import { IsBoolean, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { SqsConfig } from './sqs-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  SQS_REGION: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @IsBoolean()
  SQS_IS_FIFO: boolean;

  @IsString()
  SQS_INPUT_URL: string;

  @IsString()
  SQS_OUTPUT_URL: string;

  @IsString()
  SQS_INPUT_QUEUE: string;

  @IsString()
  SQS_OUTPUT_QUEUE: string;
}

export default registerAs<SqsConfig>('sqs', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    region: process.env.SQS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    isFifo: process.env.SQS_IS_FIFO,
    input_url: process.env.SQS_INPUT_URL,
    output_url: process.env.SQS_OUTPUT_URL,
    input_queue_name: process.env.SQS_INPUT_QUEUE,
    output_queue_name: process.env.SQS_OUTPUT_QUEUE,
  };
});
