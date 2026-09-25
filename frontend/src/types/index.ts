export type ResourceType = 'PDF' | 'IMAGE' | 'LINK' | 'NOTE' | 'VIDEO';

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  category: string;
  tags: string[];
  description: string;
  date: string;
  url?: string;
  fileSize?: string;
  ocrText?: string;
  transcript?: string;
  noteContent?: string;
  relevanceScore?: number;
}

export interface UserProfile {
  email: string;
  name: string;
  role?: string;
  isAuthorized: boolean;
}
