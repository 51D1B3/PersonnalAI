import { Controller, Get, Post, Body } from '@nestjs/common';
import { ImagesService } from './images.service.js';
import { CreateImageDto } from './dto/create-image.dto.js';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async findAll() {
    return this.imagesService.findAll();
  }

  @Post()
  async create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }
}
