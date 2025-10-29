// Type definitions for the blog application

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  category_id: string | null;
  author_id: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  created_at: string;
  posts?: {
    title: string;
    author_id: string;
  };
};
