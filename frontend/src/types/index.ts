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

export interface NavigationPermissions {
  accueil: boolean;
  documents: boolean;
  images: boolean;
  videos: boolean;
  liens: boolean;
  notes: boolean;
  recherche: boolean;
  parametres: boolean;
}

export interface AuthorizedAccount {
  email: string;
  name: string;
  role: string;
  isAuthorized: boolean;
  permissions: NavigationPermissions;
}

export const OWNER_EMAILS = [
  'mahamadousidibe2004@gmail.com',
  'mahamadousidibe2104@gmail.com',
];

export const isOwnerEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return OWNER_EMAILS.includes(email.toLowerCase().trim());
};

export const DEFAULT_AUTHORIZED_ACCOUNTS: AuthorizedAccount[] = [
  {
    email: 'mahamadousidibe2004@gmail.com',
    name: 'Sidibé (Propriétaire)',
    role: 'Propriétaire',
    isAuthorized: true,
    permissions: {
      accueil: true,
      documents: true,
      images: true,
      videos: true,
      liens: true,
      notes: true,
      recherche: true,
      parametres: true,
    },
  },
  {
    email: 'mahamadousidibe2104@gmail.com',
    name: 'Sidibé (Co-Propriétaire)',
    role: 'Co-Propriétaire',
    isAuthorized: true,
    permissions: {
      accueil: true,
      documents: true,
      images: true,
      videos: true,
      liens: true,
      notes: true,
      recherche: true,
      parametres: true,
    },
  },
];

