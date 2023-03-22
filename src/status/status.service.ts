import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Status, StatusDocument } from './schemas/status.schema';
import { Model } from 'mongoose';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Status.name)
    private StatusModel: Model<StatusDocument>,
  ) {}

  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    const createdStatus = new this.StatusModel(createStatusDto);
    return createdStatus.save();
  }

  async findAll(): Promise<Status[]> {
    return this.StatusModel.find().exec();
  }

  async findOneById(id: string) {
    return this.StatusModel.findById(id).exec();
  }

  async update(id: string, updateStatusDto: UpdateStatusDto) {
    return this.StatusModel.findByIdAndUpdate(id, updateStatusDto, {
      new: true,
    }).exec();
  }

  async remove(id: string) {
    return this.StatusModel.findByIdAndDelete(id).exec();
  }
}
