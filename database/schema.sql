-- ==========================================
-- PersonalAI - Supabase Database Schema
-- ==========================================

-- 1. Enable pgvector extension for AI & Semantic search
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Allowed Users Table (Strict Auth Control)
CREATE TABLE IF NOT EXISTS public.allowed_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Allowed Users
ALTER TABLE public.allowed_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of allowed emails" ON public.allowed_users
    FOR SELECT USING (true);

-- 3. Documents Table (PDFs, Docs)
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

-- RLS for Documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents" ON public.documents
    FOR ALL USING (auth.uid() = user_id);

-- 4. Images Table (OCR, Screenshots)
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

-- RLS for Images
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own images" ON public.images
    FOR ALL USING (auth.uid() = user_id);

-- 5. Videos Table (Transcriptions, Media)
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

-- RLS for Videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own videos" ON public.videos
    FOR ALL USING (auth.uid() = user_id);

-- 6. Links Table (Web Resources)
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

-- RLS for Links
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own links" ON public.links
    FOR ALL USING (auth.uid() = user_id);

-- 7. Notes Table (Personal Notes & Vault)
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

-- RLS for Notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notes" ON public.notes
    FOR ALL USING (auth.uid() = user_id);

-- 8. Triggers for updated_at
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

-- 9. Storage Buckets Configuration (Run in Supabase SQL Editor or Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
