import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OperationDocument = HydratedDocument<Operation>;

@Schema()
export class Operation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Operation' })
  Operation_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Status' })
  status_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  admin_id: string;

  @Prop({ type: mongoose.Schema.Types.Date })
  operation_date: Date;

  @Prop()
  description: string;
}

export const OperationSchema = SchemaFactory.createForClass(Operation);
