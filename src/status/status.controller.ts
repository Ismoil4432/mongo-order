import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post('create')
  async create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  async findAll() {
    return this.statusService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.statusService.findOneById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.statusService.update(id, updateStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.statusService.remove(id);
  }
}
