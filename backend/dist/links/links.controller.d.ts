import { LinksService } from './links.service.js';
import { CreateLinkDto } from './dto/create-link.dto.js';
export declare class LinksController {
    private readonly linksService;
    constructor(linksService: LinksService);
    findAll(): Promise<import("./links.service.js").LinkItem[]>;
    create(createLinkDto: CreateLinkDto): Promise<import("./links.service.js").LinkItem>;
}
