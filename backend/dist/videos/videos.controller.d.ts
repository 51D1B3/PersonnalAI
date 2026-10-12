import type { Request } from 'express';
import { VideosService } from './videos.service.js';
import { WhisperService } from './whisper.service.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
export declare class VideosController {
    private readonly videosService;
    private readonly whisperService;
    private readonly logsService;
    constructor(videosService: VideosService, whisperService: WhisperService, logsService: SecurityLogsService);
    findAll(): Promise<import("./videos.service.js").VideoItem[]>;
    searchVideos(query: string): Promise<import("./videos.service.js").VideoItem[]>;
    create(body: any, email?: string, req?: Request): Promise<import("./videos.service.js").VideoItem>;
    remove(id: string, email?: string, req?: Request): Promise<{
        success: boolean;
        id: string;
    }>;
    transcribe(body: {
        videoPath?: string;
        title?: string;
    }): Promise<import("./whisper.service.js").WhisperTranscriptionResult>;
}
