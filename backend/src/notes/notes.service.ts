import { Injectable, Logger } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';

export interface NoteItem {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  type: string;
  isVault: boolean;
  date: string;
}

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  // Reinitialisé à 0
  private mockNotes: NoteItem[] = [];

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<NoteItem[]> {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('notes').select('*').order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((n: any) => ({
          id: n.id,
          title: n.title,
          description: n.content ? n.content.substring(0, 100) : 'Note personnelle',
          content: n.content,
          category: n.category || 'Général',
          tags: n.tags || [],
          type: 'NOTE',
          isVault: !!n.is_vault,
          date: new Date(n.created_at || Date.now()).toLocaleDateString('fr-FR'),
        }));
      }
    } catch (e) {
      this.logger.warn(`Erreur lecture notes Supabase: ${e}`);
    }

    return this.mockNotes;
  }

  async create(createNoteDto: CreateNoteDto): Promise<NoteItem> {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: createNoteDto.title,
      description: createNoteDto.content ? createNoteDto.content.substring(0, 100) : 'Note',
      content: createNoteDto.content || '',
      category: createNoteDto.category || 'Général',
      tags: createNoteDto.tags || ['Note'],
      type: 'NOTE',
      isVault: !!createNoteDto.isVault,
      date: new Date().toLocaleDateString('fr-FR'),
    };

    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('notes').insert({
        title: createNoteDto.title,
        content: createNoteDto.content,
        category: createNoteDto.category || 'Général',
        tags: createNoteDto.tags || ['Note'],
        is_vault: !!createNoteDto.isVault,
      }).select().single();

      if (!error && data) {
        newNote.id = data.id;
      }
    } catch (e) {
      this.logger.warn(`Erreur insertion note Supabase: ${e}`);
    }

    this.mockNotes.unshift(newNote);
    return newNote;
  }

  async remove(id: string): Promise<{ success: boolean; id: string }> {
    try {
      const client = this.supabaseService.getClient();
      await client.from('notes').delete().eq('id', id);
    } catch (e) {
      this.logger.warn(`Erreur suppression note Supabase: ${e}`);
    }

    this.mockNotes = this.mockNotes.filter((n) => n.id !== id);
    return { success: true, id };
  }
}
