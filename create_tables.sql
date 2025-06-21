-- Habilitar la extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de configuración de usuario
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    targetLanguage TEXT NOT NULL DEFAULT 'english',
    creationTargetLanguage TEXT NOT NULL DEFAULT 'english',
    studyTargetLanguage TEXT NOT NULL DEFAULT 'english',
    studyMode TEXT NOT NULL DEFAULT 'audio_image_text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de flashcards
CREATE TABLE IF NOT EXISTS flashcards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    english_word TEXT NOT NULL,
    french_translation TEXT,
    spanish_translation TEXT,
    english_sentence TEXT,
    french_sentence TEXT,
    spanish_sentence TEXT,
    level TEXT NOT NULL DEFAULT 'A1',
    category_ids UUID[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_reviewed TIMESTAMP WITH TIME ZONE,
    next_review_date TIMESTAMP WITH TIME ZONE,
    review_count INTEGER DEFAULT 0
);

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT 'primary',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Crear políticas de seguridad RLS (Row Level Security)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Políticas para user_settings
CREATE POLICY "Users can view their own settings"
    ON user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON user_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Políticas para flashcards
CREATE POLICY "Users can view their own flashcards"
    ON flashcards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own flashcards"
    ON flashcards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards"
    ON flashcards FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards"
    ON flashcards FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para categories
CREATE POLICY "Users can view their own categories"
    ON categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
    ON categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
    ON categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
    ON categories FOR DELETE
    USING (auth.uid() = user_id); 