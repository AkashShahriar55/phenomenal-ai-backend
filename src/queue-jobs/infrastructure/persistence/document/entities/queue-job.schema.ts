import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import * as AutoIncrementFactory from 'mongoose-sequence';
import * as mongoose from 'mongoose';


export type QueueJobSchemaDocument = HydratedDocument<QueueJobSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QueueJobSchemaClass extends EntityDocumentHelper {

  @Prop({ required: true })
  user_id: string;

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
  error?: any;

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;
}



export const QueueJobSchema = SchemaFactory.createForClass(QueueJobSchemaClass);