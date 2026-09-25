import { VideosService } from './videos.service.js';
import { WhisperService } from './whisper.service.js';
export declare class VideosController {
    private readonly videosService;
    private readonly whisperService;
    constructor(videosService: VideosService, whisperService: WhisperService);
    findAll(): Promise<import("./videos.service.js").VideoItem[]>;
    create(body: any): Promise<import("./videos.service.js").VideoItem>;
    transcribe(body: {
        videoPath?: string;
        title?: string;
    }): Promise<import("./whisper.service.js").WhisperTranscriptionResult>;
}
