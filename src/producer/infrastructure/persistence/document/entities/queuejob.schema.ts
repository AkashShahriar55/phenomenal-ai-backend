import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type QueueJobSchemaDocument = HydratedDocument<QueueJobClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QueueJobClass extends EntityDocumentHelper {
  @Prop({ unique: true, required: true })
  message_id: string;

  @Prop({ type: Object, required: true })
  message: any;

  @Prop({ type: Object, required: true })
  entity: any;

  @Prop({ required: true })
  queue: string;

  @Prop({ required: true })
  job_type: string;

  @Prop({ default: 0 })
  status: number;

  @Prop({ default: 0 })
  counter: number;

  @Prop({ type: Object, required: false })
  error: any;
}

export const QueueJobSchema = SchemaFactory.createForClass(QueueJobClass);
