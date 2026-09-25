import { Controller, Get, Post, Body } from '@nestjs/common';
import { LinksService } from './links.service.js';
import { CreateLinkDto } from './dto/create-link.dto.js';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  async findAll() {
    return this.linksService.findAll();
  }

  @Post()
  async create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }
}
