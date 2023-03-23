import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './../../admin/dto/create-admin.dto';

export class UpdateOrderDto extends PartialType(CreateAdminDto) {
  order_unique_id?: string;
  truck?: string;
}
