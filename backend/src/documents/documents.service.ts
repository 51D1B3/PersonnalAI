import { Injectable, Logger } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  type: string;
  date: string;
  filePath?: string;
  contentText?: string;
}

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  private mockDocuments: DocumentItem[] = [];

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<DocumentItem[]> {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('documents').select('*');

      if (!error && data && data.length > 0) {
        return data.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          description: doc.description,
          category: doc.category || 'Général',
          tags: doc.tags || [],
          type: doc.file_type || 'PDF',
          date: new Date(doc.created_at).toLocaleDateString('fr-FR'),
          filePath: doc.file_path,
          contentText: doc.content_text,
        }));
      }
    } catch (e) {
      this.logger.warn(`Erreur de lecture Supabase: ${e}`);
    }

    return this.mockDocuments;
  }

  async create(createDocumentDto: CreateDocumentDto): Promise<DocumentItem> {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: createDocumentDto.title,
      description: createDocumentDto.description,
      category: createDocumentDto.category || 'Général',
      tags: createDocumentDto.tags || ['Document'],
      type: 'PDF',
      date: new Date().toLocaleDateString('fr-FR'),
      filePath: createDocumentDto.filePath,
      contentText: createDocumentDto.contentText,
    };

    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('documents').insert({
        title: createDocumentDto.title,
        description: createDocumentDto.description,
        category: createDocumentDto.category || 'Général',
        tags: createDocumentDto.tags || ['Document'],
        file_path: createDocumentDto.filePath,
        content_text: createDocumentDto.contentText,
      }).select().single();

      if (!error && data) {
        newDoc.id = data.id;
      }
    } catch (e) {
      this.logger.warn(`Erreur insertion Supabase: ${e}`);
    }

    this.mockDocuments.unshift(newDoc);
    return newDoc;
  }

  async remove(id: string): Promise<{ success: boolean; id: string }> {
    try {
      const client = this.supabaseService.getClient();
      await client.from('documents').delete().eq('id', id);
    } catch (e) {
      this.logger.warn(`Erreur suppression Supabase: ${e}`);
    }

    this.mockDocuments = this.mockDocuments.filter(doc => doc.id !== id);
    return { success: true, id };
  }
}
