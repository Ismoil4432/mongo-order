import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CurrencyTypeService } from './currency_type.service';
import { CreateCurrencyTypeDto } from './dto/create-currency_type.dto';
import { UpdateCurrencyTypeDto } from './dto/update-currency_type.dto';
import { AdminCreatorGuard } from '../guards/admin-creator.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('currency-type')
export class CurrencyTypeController {
  constructor(private readonly currencyTypeService: CurrencyTypeService) {}

  @UseGuards(AdminCreatorGuard)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createCurrencyTypeDto: CreateCurrencyTypeDto) {
    return this.currencyTypeService.create(createCurrencyTypeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.currencyTypeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.currencyTypeService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('name/:name')
  async findOneByName(@Param('name') name: string) {
    return this.currencyTypeService.findOneByName(name);
  }

  @UseGuards(AdminCreatorGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCurrencyTypeDto: UpdateCurrencyTypeDto,
  ) {
    return this.currencyTypeService.update(id, updateCurrencyTypeDto);
  }

  @UseGuards(AdminCreatorGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.currencyTypeService.remove(id);
  }
}
