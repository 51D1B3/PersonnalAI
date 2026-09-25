import { ImagesService } from './images.service.js';
import { CreateImageDto } from './dto/create-image.dto.js';
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    findAll(): Promise<import("./images.service.js").ImageItem[]>;
    create(createImageDto: CreateImageDto): Promise<import("./images.service.js").ImageItem>;
}
