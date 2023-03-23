import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
  @Prop()
  full_name: string;

  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true })
  hashed_password: string;

  @Prop()
  phone_number: string;

  @Prop()
  email: string;

  @Prop()
  tg_link: string;

  @Prop()
  hashed_token: string;

  @Prop({ default: false })
  is_creator: boolean;

  @Prop({ default: false })
  is_active: boolean;

  @Prop()
  description: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
