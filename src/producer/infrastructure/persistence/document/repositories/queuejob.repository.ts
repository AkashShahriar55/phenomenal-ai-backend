import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QueueJobRepository } from '../../queuejob.repository';
import { QueueJobClass } from '../entities/queuejob.schema';

@Injectable()
export class QueueJobDocumentRepository implements QueueJobRepository {
  constructor(
    @InjectModel(QueueJobClass.name)
    private queueJobModel: Model<QueueJobClass>,
  ) {}

  async create(data: Partial<QueueJobClass>): Promise<QueueJobClass> {
    const createdSession = new this.queueJobModel(data);
    const sessionObject = await createdSession.save();
    return sessionObject;
  }
}
