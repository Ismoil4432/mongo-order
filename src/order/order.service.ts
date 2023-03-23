import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { v4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = await new this.orderModel(createOrderDto).save();
    const updateOrder = await this.orderModel
      .findByIdAndUpdate(
        String(createdOrder._id),
        { order_unique_id: String(createdOrder._id) },
        { new: true },
      )
      .populate('currency_type_id');
    return updateOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('currency_type_id').exec();
  }

  async findOneById(id: string) {
    return this.orderModel.findById(id).exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
