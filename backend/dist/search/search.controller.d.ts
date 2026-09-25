import { SearchService } from './search.service.js';
import { ClassicSearchDto } from './dto/classic-search.dto.js';
import { SemanticSearchDto } from './dto/semantic-search.dto.js';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    classicSearch(queryDto: ClassicSearchDto): Promise<import("./search.service.js").SearchResultItem[]>;
    semanticSearch(semanticDto: SemanticSearchDto): Promise<{
        query: string;
        results: import("./search.service.js").SearchResultItem[];
    }>;
}
