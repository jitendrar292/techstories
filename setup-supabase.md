# Supabase Setup Guide

## The current Supabase instance appears to be inactive (404 error). Here's how to set up a new one:

## Step 1: Create New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose organization and enter project details:
   - Name: "My Real Tech Stories"
   - Database Password: (choose a secure password)
   - Region: Choose closest to your location

## Step 2: Get Project Credentials

After project creation (takes ~2 minutes):
1. Go to Settings → API
2. Copy the following:
   - Project URL
   - Project API keys → `anon` `public` key

## Step 3: Update Environment Variables

Update your `.env` file with the new credentials:

```env
VITE_SUPABASE_URL=your_new_project_url_here
VITE_SUPABASE_ANON_KEY=your_new_anon_key_here
```

## Step 4: Set Up Database Schema

Run these SQL commands in the Supabase SQL Editor (Dashboard → SQL Editor):

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image VARCHAR(500),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES categories(id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, authenticated write)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are editable by authenticated users" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Posts are editable by their authors" ON posts
  FOR ALL USING (auth.uid() = author_id);

-- Insert some sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Posts about latest technology trends'),
  ('Programming', 'programming', 'Coding tutorials and tips'),
  ('Career', 'career', 'Career advice and experiences'),
  ('Personal', 'personal', 'Personal stories and thoughts');
```

## Step 5: Configure CORS (if needed)

In Supabase Dashboard:
1. Go to Settings → API
2. Scroll to "CORS origins"
3. Add: `http://localhost:5173`

## Step 6: Test the Connection

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

The CORS error should be resolved!