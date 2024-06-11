import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import * as AutoIncrementFactory from 'mongoose-sequence';
import * as mongoose from 'mongoose';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { Type } from 'class-transformer';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';


export type QueueJobSchemaDocument = HydratedDocument<QueueJobSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QueueJobSchemaClass extends EntityDocumentHelper {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSchemaClass' })
  user: UserSchemaClass;

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


  @Prop({
    type: FileSchemaClass,
  })
  @Type(() => FileSchemaClass)
  output?: FileSchemaClass | null;

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