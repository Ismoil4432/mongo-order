import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrencyTypeService } from './currency_type.service';
import { CreateCurrencyTypeDto } from './dto/create-currency_type.dto';
import { UpdateCurrencyTypeDto } from './dto/update-currency_type.dto';

@Controller('currency-type')
export class CurrencyTypeController {
  constructor(private readonly currencyTypeService: CurrencyTypeService) {}

  @Post('create')
  async create(@Body() createCurrencyTypeDto: CreateCurrencyTypeDto) {
    return this.currencyTypeService.create(createCurrencyTypeDto);
  }

  @Get()
  async findAll() {
    return this.currencyTypeService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.currencyTypeService.findOneById(id);
  }

  @Get('name/:name')
  async findOneByName(@Param('name') name: string) {
    return this.currencyTypeService.findOneByName(name);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCurrencyTypeDto: UpdateCurrencyTypeDto,
  ) {
    return this.currencyTypeService.update(id, updateCurrencyTypeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.currencyTypeService.remove(id);
  }
}
