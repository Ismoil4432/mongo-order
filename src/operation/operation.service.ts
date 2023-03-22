import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Operation, OperationDocument } from './schemas/operation.schema';
import { Model } from 'mongoose';

@Injectable()
export class OperationService {
  constructor(
    @InjectModel(Operation.name)
    private OperationModel: Model<OperationDocument>,
  ) {}

  async create(createOperationDto: CreateOperationDto): Promise<Operation> {
    const createdOperation = new this.OperationModel(createOperationDto);
    return createdOperation.save();
  }

  async findAll(): Promise<Operation[]> {
    return this.OperationModel.find().exec();
  }

  async findOneById(id: string) {
    return this.OperationModel.findById(id).exec();
  }

  async update(id: string, updateOperationDto: UpdateOperationDto) {
    return this.OperationModel.findByIdAndUpdate(id, updateOperationDto, {
      new: true,
    }).exec();
  }

  async remove(id: string) {
    return this.OperationModel.findByIdAndDelete(id).exec();
  }
}
