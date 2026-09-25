import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  type: string;
  date: string;
  videoPath?: string;
  transcript?: string;
}

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);

  private mockVideos: VideoItem[] = [];

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<VideoItem[]> {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('videos').select('*');

      if (!error && data && data.length > 0) {
        return data.map((v: any) => ({
          id: v.id,
          title: v.title,
          description: v.description,
          category: v.category || 'Général',
          tags: v.tags || [],
          type: 'VIDEO',
          date: new Date(v.created_at).toLocaleDateString('fr-FR'),
          videoPath: v.video_path,
          transcript: v.transcript_text,
        }));
      }
    } catch (e) {
      this.logger.warn(`Erreur lecture vidéos Supabase: ${e}`);
    }

    return this.mockVideos;
  }

  async create(body: any): Promise<VideoItem> {
    const newVid: VideoItem = {
      id: `vid-${Date.now()}`,
      title: body.title,
      description: body.description,
      category: body.category || 'Général',
      tags: body.tags || ['Vidéo'],
      type: 'VIDEO',
      date: new Date().toLocaleDateString('fr-FR'),
      videoPath: body.videoPath || '/uploads/sample.mp4',
      transcript: body.transcript || 'Transcription automatique générée via Whisper',
    };

    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('videos').insert({
        title: body.title,
        description: body.description,
        category: body.category || 'Général',
        tags: body.tags || ['Vidéo'],
        video_path: newVid.videoPath,
        transcript_text: newVid.transcript,
      }).select().single();

      if (!error && data) {
        newVid.id = data.id;
      }
    } catch (e) {
      this.logger.warn(`Erreur insertion vidéo Supabase: ${e}`);
    }

    this.mockVideos.unshift(newVid);
    return newVid;
  }
}
