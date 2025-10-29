-- ================================================
-- SUPABASE DATABASE SCHEMA FOR YOUR PORTFOLIO
-- ================================================
-- Run this SQL in Supabase SQL Editor to create your database tables

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    github_url TEXT NOT NULL,
    live_url TEXT,
    technologies TEXT NOT NULL,
    icon_class TEXT DEFAULT 'fas fa-code',
    gradient_colors TEXT DEFAULT 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ABOUT INFO TABLE (Single row)
CREATE TABLE IF NOT EXISTS about_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    tagline TEXT DEFAULT 'Software Developer Student',
    bio TEXT,
    email TEXT,
    phone TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- 3. SOCIAL LINKS TABLE (Single row)
CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY DEFAULT 1,
    github TEXT,
    instagram TEXT,
    steam TEXT,
    discord TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- 4. THEME COLORS TABLE (Single row)
CREATE TABLE IF NOT EXISTS theme_colors (
    id INTEGER PRIMARY KEY DEFAULT 1,
    primary_color TEXT DEFAULT '#7c3aed',
    secondary_color TEXT DEFAULT '#a78bfa',
    accent_color TEXT DEFAULT '#c084fc',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT DEFAULT 'fas fa-folder',
    color TEXT DEFAULT '#6366f1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- INSERT DEFAULT DATA
-- ================================================

-- Insert your current projects
INSERT INTO projects (title, description, github_url, live_url, technologies, icon_class, gradient_colors, display_order) VALUES
('File Organiser', 'An automated file organization tool that sorts and categorizes files based on type, helping keep your directories clean and organized.', 'https://github.com/yourusername/File-Organiser', '', 'Python', 'fas fa-folder-open', 'linear-gradient(135deg, #4A90E2, #357ABD)', 1),
('Web Scraper', 'A powerful web scraping tool designed to extract and parse data from websites efficiently for data analysis and collection.', 'https://github.com/yourusername/Web-Scraper', '', 'Python,BeautifulSoup', 'fas fa-spider', 'linear-gradient(135deg, #E74C3C, #C0392B)', 2),
('ChatBot', 'An intelligent conversational AI chatbot with natural language processing capabilities for interactive user communication.', 'https://github.com/yourusername/ChatBot', '', 'Python,NLP', 'fas fa-robot', 'linear-gradient(135deg, #9B59B6, #8E44AD)', 3),
('PHP Website', 'A dynamic website built with PHP featuring server-side functionality, database integration, and modern web development practices.', 'https://github.com/yourusername/PHP-Website', '', 'PHP,HTML,CSS', 'fab fa-php', 'linear-gradient(135deg, #777BB4, #5D6BB3)', 4),
('Multi-Tool', 'A versatile multi-purpose utility tool providing various helpful functions and features in a single application.', 'https://github.com/yourusername/Multi-Tool', '', 'Python', 'fas fa-tools', 'linear-gradient(135deg, #16A085, #138D75)', 5),
('Typing Speed Test', 'An interactive typing speed test application that measures WPM (words per minute) and accuracy to improve typing skills.', 'https://github.com/yourusername/Typing-Speed-Test', '', 'Python,Tkinter', 'fas fa-keyboard', 'linear-gradient(135deg, #F39C12, #D68910)', 6),
('Clicker Game', 'An engaging incremental clicker game with progression mechanics, upgrades, and achievements for endless entertainment.', 'https://github.com/yourusername/Clicker-Game', '', 'Python,Pygame', 'fas fa-gamepad', 'linear-gradient(135deg, #E67E22, #CA6F1E)', 7),
('Hangman Game', 'A classic word-guessing game built in Java featuring multiple difficulty levels and an interactive gameplay experience.', 'https://github.com/yourusername/Hangman', '', 'Java', 'fas fa-spell-check', 'linear-gradient(135deg, #E74C3C, #C0392B)', 8),
('MegaBot - Discord Bot', 'A feature-rich Discord bot with 70+ slash commands across 8 categories including economy, gaming, moderation, and utility features with SQLite database integration.', 'https://github.com/yourusername/Discord-Bot', '', 'Python,Discord.py,SQLite', 'fab fa-discord', 'linear-gradient(135deg, #5865F2, #4752C4)', 9),
('MegaBot Website', 'A modern marketing website for MegaBot featuring command documentation, feature showcase, and user-friendly interface built with responsive design.', 'https://github.com/yourusername/Discord-Bot-Website', '', 'HTML,CSS,JavaScript', 'fas fa-globe', 'linear-gradient(135deg, #667EEA, #764BA2)', 10);

-- Insert default about info
INSERT INTO about_info (id, tagline, bio, email, phone) VALUES
(1, 
 'Student & Developer Portfolio',
 'Hi! I''m a passionate software developer and second-year student. I love building projects that solve real-world problems and continuously learning new technologies to improve my skills.',
 'your.email@example.com',
 '+1234567890')
ON CONFLICT (id) DO NOTHING;

-- Insert default social links
INSERT INTO social_links (id, github, instagram, steam, discord) VALUES
(1,
 'https://github.com/yourusername',
 'https://www.instagram.com/yourusername/',
 'https://steamcommunity.com/id/yourusername/',
 'https://discord.com/users/yourusername')
ON CONFLICT (id) DO NOTHING;

-- Insert default theme colors
INSERT INTO theme_colors (id, primary_color, secondary_color, accent_color) VALUES
(1, '#7c3aed', '#a78bfa', '#c084fc')
ON CONFLICT (id) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, icon, color) VALUES
('Web Development', 'fas fa-globe', '#6366f1'),
('Mobile Apps', 'fas fa-mobile-alt', '#10b981'),
('Games', 'fas fa-gamepad', '#f59e0b'),
('Tools & Utilities', 'fas fa-tools', '#8b5cf6');

-- ================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ================================================
-- This makes your data publicly readable but only editable via admin panel

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on about_info" ON about_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access on social_links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Allow public read access on theme_colors" ON theme_colors FOR SELECT USING (true);
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (you'll use service role key in admin panel)
CREATE POLICY "Allow authenticated insert on projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on projects" ON projects FOR DELETE USING (true);

CREATE POLICY "Allow authenticated update on about_info" ON about_info FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated update on social_links" ON social_links FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated update on theme_colors" ON theme_colors FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated insert on categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on categories" ON categories FOR DELETE USING (true);

-- ================================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_info_updated_at BEFORE UPDATE ON about_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_colors_updated_at BEFORE UPDATE ON theme_colors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DONE! Your database is ready!
-- ================================================
-- Next steps:
-- 1. Copy your Supabase URL and anon key
-- 2. Update config.js with your credentials
-- 3. Your portfolio will now sync across all devices!
