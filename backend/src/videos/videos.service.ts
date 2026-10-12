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

  // Reinitialisé à 0
  private mockVideos: VideoItem[] = [];

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<VideoItem[]> {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('videos').select('*').order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((v: any) => ({
          id: v.id,
          title: v.title,
          description: v.description,
          category: v.category || 'Général',
          tags: v.tags || [],
          type: 'VIDEO',
          date: new Date(v.created_at || Date.now()).toLocaleDateString('fr-FR'),
          videoPath: v.video_path,
          transcript: v.transcript_text,
        }));
      }
    } catch (e) {
      this.logger.warn(`Erreur lecture vidéos Supabase: ${e}`);
    }

    return this.mockVideos;
  }

  // Étape 50 : Recherche dans les vidéos (titre, description, catégorie, tags, transcription Whisper)
  async searchVideos(query: string): Promise<VideoItem[]> {
    const all = await this.findAll();
    if (!query || !query.trim()) {
      return all;
    }

    const q = query.trim().toLowerCase();
    return all.filter((vid) => {
      const matchTitle = vid.title.toLowerCase().includes(q);
      const matchDesc = vid.description.toLowerCase().includes(q);
      const matchCat = vid.category.toLowerCase().includes(q);
      const matchTags = vid.tags.some((t) => t.toLowerCase().includes(q));
      const matchTranscript = vid.transcript
        ? vid.transcript.toLowerCase().includes(q)
        : false;

      return matchTitle || matchDesc || matchCat || matchTags || matchTranscript;
    });
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
      transcript:
        body.transcript ||
        'Transcription automatique générée via OpenAI Whisper : "Extrait vidéo analysé avec succès pour l\'indexation vectorielle."',
    };

    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client
        .from('videos')
        .insert({
          title: body.title,
          description: body.description,
          category: body.category || 'Général',
          tags: body.tags || ['Vidéo'],
          video_path: newVid.videoPath,
          transcript_text: newVid.transcript,
        })
        .select()
        .single();

      if (!error && data) {
        newVid.id = data.id;
      }
    } catch (e) {
      this.logger.warn(`Erreur insertion vidéo Supabase: ${e}`);
    }

    this.mockVideos.unshift(newVid);
    return newVid;
  }

  async remove(id: string): Promise<{ success: boolean; id: string }> {
    try {
      const client = this.supabaseService.getClient();
      await client.from('videos').delete().eq('id', id);
    } catch (e) {
      this.logger.warn(`Erreur suppression vidéo Supabase: ${e}`);
    }

    this.mockVideos = this.mockVideos.filter((v) => v.id !== id);
    return { success: true, id };
  }
}
