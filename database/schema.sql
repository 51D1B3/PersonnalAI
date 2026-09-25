-- ==========================================
-- PersonalAI - Database Schema (Supabase / PostgreSQL + pgvector)
-- ==========================================

-- 1. Enable pgvector extension & uuid-ossp for AI Vector search
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Allowed Users Table (Strict Auth Access Control - 2 Authorized Emails)
CREATE TABLE IF NOT EXISTS public.allowed_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'User',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Predefined Allowed Users (Cahier des charges: 2 email accounts)
INSERT INTO public.allowed_users (email, name, role) 
VALUES 
    ('sidibe@personalai.dev', 'Sidibé', 'Propriétaire'),
    ('admin@personalai.dev', 'Administrateur', 'Co-Propriétaire')
ON CONFLICT (email) DO NOTHING;

-- RLS for Allowed Users
ALTER TABLE public.allowed_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read of allowed emails" ON public.allowed_users FOR SELECT USING (true);

-- 3. Users Profile Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Documents Table (PDFs, Docs)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT,
    file_type TEXT DEFAULT 'PDF',
    file_size BIGINT,
    category TEXT DEFAULT 'Général',
    tags TEXT[] DEFAULT '{}',
    content_text TEXT,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own documents" ON public.documents FOR ALL USING (auth.uid() = user_id);

-- 5. Images Table (Screenshots, OCR)
CREATE TABLE IF NOT EXISTS public.images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_path TEXT NOT NULL,
    ocr_text TEXT,
    category TEXT DEFAULT 'Général',
    tags TEXT[] DEFAULT '{}',
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own images" ON public.images FOR ALL USING (auth.uid() = user_id);

-- 6. Videos Table (Transcriptions Whisper, Media)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_path TEXT NOT NULL,
    transcript_text TEXT,
    category TEXT DEFAULT 'Général',
    tags TEXT[] DEFAULT '{}',
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own videos" ON public.videos FOR ALL USING (auth.uid() = user_id);

-- 7. Links Table (Web Resources, Bookmarks)
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Général',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own links" ON public.links FOR ALL USING (auth.uid() = user_id);

-- 8. Notes Table (Personal Notes & Vault)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT DEFAULT 'Général',
    tags TEXT[] DEFAULT '{}',
    is_vault BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notes" ON public.notes FOR ALL USING (auth.uid() = user_id);

-- 9. Tags Table (Étape 16 & 17 - Dedicated Tags Entity & Relations)
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#51D1B3',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Junction Table for Tag Relations across resources
CREATE TABLE IF NOT EXISTS public.resource_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    image_id UUID REFERENCES public.images(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Triggers for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_modtime BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_images_modtime BEFORE UPDATE ON public.images FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_videos_modtime BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_links_modtime BEFORE UPDATE ON public.links FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_notes_modtime BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 11. pgvector Vector Search RPC Functions (Étape 37 & 38)
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  category text,
  file_type text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.title,
    documents.description,
    documents.category,
    documents.file_type,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM public.documents
  WHERE documents.embedding IS NOT NULL AND 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

CREATE OR REPLACE FUNCTION match_all_resources (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.4,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  category text,
  tags text[],
  type text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT d.id, d.title, d.description, d.category, d.tags, d.file_type AS type, (1 - (d.embedding <=> query_embedding)) AS similarity
  FROM public.documents d WHERE d.embedding IS NOT NULL AND (1 - (d.embedding <=> query_embedding)) > match_threshold
  UNION ALL
  SELECT i.id, i.title, i.description, i.category, i.tags, 'IMAGE' AS type, (1 - (i.embedding <=> query_embedding)) AS similarity
  FROM public.images i WHERE i.embedding IS NOT NULL AND (1 - (i.embedding <=> query_embedding)) > match_threshold
  UNION ALL
  SELECT n.id, n.title, n.content AS description, n.category, n.tags, 'NOTE' AS type, (1 - (n.embedding <=> query_embedding)) AS similarity
  FROM public.notes n WHERE n.embedding IS NOT NULL AND (1 - (n.embedding <=> query_embedding)) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

