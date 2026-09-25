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

  private mockNotes: NoteItem[] = [
    {
      id: 'note-1',
      title: 'Notes de Configuration Supabase & JWT Tokens',
      description: 'Mémo pour la gestion des variables d\'environnement et des clés de rôles de service.',
      content: 'SUPABASE_URL=https://my-project.supabase.co\nDATABASE_URL=postgresql://...',
      category: 'Sécurité',
      tags: ['Config', 'Env', 'Tokens'],
      type: 'NOTE',
      isVault: true,
      date: '18 Septembre 2026',
    }
  ];

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<NoteItem[]> {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('notes').select('*');

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
          date: new Date(n.created_at).toLocaleDateString('fr-FR'),
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
      description: createNoteDto.content.substring(0, 100),
      content: createNoteDto.content,
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
}
