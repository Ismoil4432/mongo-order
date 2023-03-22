import { Injectable } from '@nestjs/common';
import { CreateCurrencyTypeDto } from './dto/create-currency_type.dto';
import { UpdateCurrencyTypeDto } from './dto/update-currency_type.dto';
import {
  CurrencyType,
  CurrencyTypeDocument,
} from './schemas/currency_type.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CurrencyTypeService {
  constructor(
    @InjectModel(CurrencyType.name)
    private CurrencyTypeModel: Model<CurrencyTypeDocument>,
  ) {}

  async create(
    createCurrencyTypeDto: CreateCurrencyTypeDto,
  ): Promise<CurrencyType> {
    const createdCurrencyType = new this.CurrencyTypeModel(
      createCurrencyTypeDto,
    );
    return createdCurrencyType.save();
  }

  async findAll(): Promise<CurrencyType[]> {
    return this.CurrencyTypeModel.find().exec();
  }

  async findOneById(id: string) {
    return this.CurrencyTypeModel.findById(id).exec();
  }

  async findOneByName(name: string): Promise<CurrencyType> {
    return this.CurrencyTypeModel.findOne({ name }).exec();
  }

  async update(id: string, updateCurrencyTypeDto: UpdateCurrencyTypeDto) {
    return this.CurrencyTypeModel.findByIdAndUpdate(id, updateCurrencyTypeDto, {
      new: true,
    }).exec();
  }

  async remove(id: string) {
    return this.CurrencyTypeModel.findByIdAndDelete(id).exec();
  }
}
