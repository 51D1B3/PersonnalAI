import { Injectable, Logger } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';

export interface LinkItem {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  type: string;
  date: string;
}

@Injectable()
export class LinksService {
  private readonly logger = new Logger(LinksService.name);

  private mockLinks: LinkItem[] = [];

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<LinkItem[]> {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('links').select('*');

      if (!error && data && data.length > 0) {
        return data.map((l: any) => ({
          id: l.id,
          name: l.name,
          url: l.url,
          description: l.description,
          category: l.category || 'Général',
          tags: l.tags || [],
          type: 'LINK',
          date: new Date(l.created_at).toLocaleDateString('fr-FR'),
        }));
      }
    } catch (e) {
      this.logger.warn(`Erreur lecture links Supabase: ${e}`);
    }

    return this.mockLinks;
  }

  async create(createLinkDto: CreateLinkDto): Promise<LinkItem> {
    const newLink: LinkItem = {
      id: `link-${Date.now()}`,
      name: createLinkDto.name,
      url: createLinkDto.url,
      description: createLinkDto.description || 'Lien web enregistré',
      category: createLinkDto.category || 'Général',
      tags: createLinkDto.tags || ['Web'],
      type: 'LINK',
      date: new Date().toLocaleDateString('fr-FR'),
    };

    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('links').insert({
        name: createLinkDto.name,
        url: createLinkDto.url,
        description: createLinkDto.description,
        category: createLinkDto.category || 'Général',
        tags: createLinkDto.tags || ['Web'],
      }).select().single();

      if (!error && data) {
        newLink.id = data.id;
      }
    } catch (e) {
      this.logger.warn(`Erreur insertion link Supabase: ${e}`);
    }

    this.mockLinks.unshift(newLink);
    return newLink;
  }
}
