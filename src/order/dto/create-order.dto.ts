export class CreateOrderDto {
  full_name: string;
  phone_number: string;
  product_link: string;
  summa: number;
  currency_type_id: string;
  email?: string;
  description?: string;
}
