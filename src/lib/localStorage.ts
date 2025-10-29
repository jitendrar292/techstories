// Local Storage implementation for persistent data
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  category_id: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  user_metadata: { full_name: string };
}

class LocalStorageDB {
  private POSTS_KEY = 'tech-blog-posts';
  private CATEGORIES_KEY = 'tech-blog-categories';
  private USER_KEY = 'tech-blog-user';
  private AUTH_KEY = 'tech-blog-auth';
  private CREDENTIALS_KEY = 'tech-blog-credentials';

  constructor() {
    this.initializeDefaultData();
    this.initializeDefaultCredentials();
    console.log('📦 LocalStorage initialized');
    console.log('📝 Posts count:', this.getPosts().length);
    console.log('📁 Categories count:', this.getCategories().length);
  }

  private initializeDefaultCredentials() {
    if (!localStorage.getItem(this.CREDENTIALS_KEY)) {
      // Default credentials: username = "admin", password = "admin"
      const defaultCredentials = {
        username: 'admin',
        password: 'admin', // In real app, this should be hashed
        email: 'admin@techstories.com'
      };
      localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(defaultCredentials));
      console.log('🔐 Default credentials created: username="admin", password="admin"');
    }
  }

  private initializeDefaultData() {
    // Initialize categories if they don't exist
    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      const defaultCategories: Category[] = [
        {
          id: '1',
          name: 'Technology',
          slug: 'technology',
          description: 'Posts about latest technology trends',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Programming',
          slug: 'programming',
          description: 'Coding tutorials and tips',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Career',
          slug: 'career',
          description: 'Career advice and experiences',
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'AI & Machine Learning',
          slug: 'ai-ml',
          description: 'Artificial Intelligence and ML insights',
          created_at: new Date().toISOString()
        }
      ];
      this.saveCategories(defaultCategories);
    }

    // Initialize posts if they don't exist
    if (!localStorage.getItem(this.POSTS_KEY)) {
      const defaultPosts: Post[] = [
        {
          id: '1',
          title: 'Welcome to My Real Tech Stories',
          slug: 'welcome-to-my-real-tech-stories',
          content: `# Welcome to My Real Tech Stories! 🚀

## About This Blog

This is where I share my real experiences, insights, and stories from the tech world. Whether you're a seasoned developer, a tech enthusiast, or someone just starting their journey, you'll find valuable content here.

## What You'll Find Here

- **Real-world experiences** from software development
- **Career insights** and growth stories
- **Technology deep-dives** and tutorials
- **Industry trends** and analysis
- **Personal reflections** on the tech journey

## Why "Real" Stories?

Too often, tech blogs showcase only the successes and polished outcomes. Here, I share the full picture - the challenges, failures, lessons learned, and the messy reality of working in tech.

## Getting Started

Feel free to browse the categories, leave comments, and connect with me on social media. This blog is built with React, TypeScript, and uses local storage for data persistence.

Happy reading! 📚`,
          excerpt: 'Welcome to my tech blog where I share real, unfiltered stories from the technology world.',
          featured_image: null,
          category_id: '1',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: 'local-user'
        },
        {
          id: '2',
          title: 'Building This Blog: A Meta Story',
          slug: 'building-this-blog-meta-story',
          content: `# Building This Blog: A Meta Story

## The Challenge

When I decided to create "My Real Tech Stories," I faced an interesting challenge: how to build a modern blog application that works without complex backend infrastructure.

## The Solution

Instead of using traditional databases, this blog uses browser localStorage for data persistence. Here's why this approach works well for a personal blog:

### Advantages of localStorage:
- **No server costs** - Everything runs client-side
- **Instant performance** - No network requests for data
- **Simple deployment** - Just static files
- **Easy backup** - Data can be exported as JSON

### The Architecture:
- **Frontend**: React + TypeScript + Vite
- **Storage**: Browser localStorage
- **Styling**: CSS-in-JS with inline styles
- **Routing**: React Router

## Implementation Details

The storage layer abstracts the localStorage operations and provides a clean API that mimics traditional database operations:

\`\`\`typescript
// Example: Fetching posts
const posts = await storage.posts.getAll();

// Example: Creating a post
await storage.posts.create(newPost);
\`\`\`

This makes it easy to switch to a real database later if needed.

## What's Next?

Future improvements could include:
- Export/import functionality
- Search capabilities
- Comments system
- Analytics
- SEO optimization

Stay tuned for more technical deep-dives! 🔧`,
          excerpt: 'The story behind building this blog and the technical decisions that made it possible.',
          featured_image: null,
          category_id: '2',
          published: true,
          published_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          author_id: 'local-user'
        }
      ];
      this.savePosts(defaultPosts);
    }
  }

  // Posts operations
  getPosts(): Post[] {
    const posts = localStorage.getItem(this.POSTS_KEY);
    return posts ? JSON.parse(posts) : [];
  }

  getPost(id: string): Post | null {
    const posts = this.getPosts();
    return posts.find(p => p.id === id) || null;
  }

  getPostBySlug(slug: string): Post | null {
    const posts = this.getPosts();
    return posts.find(p => p.slug === slug) || null;
  }

  savePosts(posts: Post[]): void {
    localStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
  }

  createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Post {
    const posts = this.getPosts();
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    posts.push(newPost);
    this.savePosts(posts);
    console.log('📝 Created post:', newPost.title);
    return newPost;
  }

  updatePost(id: string, updates: Partial<Post>): Post | null {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index >= 0) {
      posts[index] = {
        ...posts[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.savePosts(posts);
      console.log('✏️ Updated post:', posts[index].title);
      return posts[index];
    }
    return null;
  }

  deletePost(id: string): boolean {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index >= 0) {
      const deletedPost = posts.splice(index, 1)[0];
      this.savePosts(posts);
      console.log('🗑️ Deleted post:', deletedPost.title);
      return true;
    }
    return false;
  }

  // Categories operations
  getCategories(): Category[] {
    const categories = localStorage.getItem(this.CATEGORIES_KEY);
    return categories ? JSON.parse(categories) : [];
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
  }

  // Auth operations
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.AUTH_KEY);
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  validateCredentials(username: string, password: string): boolean {
    const credentials = localStorage.getItem(this.CREDENTIALS_KEY);
    if (!credentials) return false;
    
    const stored = JSON.parse(credentials);
    return stored.username === username && stored.password === password;
  }

  updateCredentials(username: string, password: string, email: string): void {
    const credentials = { username, password, email };
    localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(credentials));
    console.log('🔐 Credentials updated');
  }

  getCredentials(): { username: string; email: string } | null {
    const credentials = localStorage.getItem(this.CREDENTIALS_KEY);
    if (!credentials) return null;
    
    const stored = JSON.parse(credentials);
    return { username: stored.username, email: stored.email };
  }

  // Utility operations
  exportData(): string {
    return JSON.stringify({
      posts: this.getPosts(),
      categories: this.getCategories(),
      exported_at: new Date().toISOString(),
    }, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.posts) this.savePosts(data.posts);
      if (data.categories) this.saveCategories(data.categories);
      console.log('📥 Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Import failed:', error);
      return false;
    }
  }

  clearAllData(): void {
    localStorage.removeItem(this.POSTS_KEY);
    localStorage.removeItem(this.CATEGORIES_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.AUTH_KEY);
    console.log('🧹 All data cleared');
  }
}

export const localStorageDB = new LocalStorageDB();