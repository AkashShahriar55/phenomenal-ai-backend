export type SqsConfig = {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  isFifo?: string;
  input_url?: string;
  output_url?: string;
  input_queue_name?: string;
  output_queue_name?: string;
};
