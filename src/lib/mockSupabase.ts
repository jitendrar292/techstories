// Mock data store for local development
interface MockPost {
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

interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

class MockSupabase {
  private posts: MockPost[] = [
    {
      id: '1',
      title: 'Welcome to My Real Tech Stories',
      slug: 'welcome-to-my-real-tech-stories',
      content: '# Welcome!\n\nThis is your first blog post. You can edit this content or create new posts.',
      excerpt: 'Welcome to my tech blog where I share real stories from the tech world.',
      featured_image: null,
      category_id: '1',
      published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_id: 'mock-user-id'
    }
  ];

  private categories: MockCategory[] = [
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
    }
  ];

  private mockUser = {
    id: 'mock-user-id',
    email: 'demo@example.com',
    user_metadata: { full_name: 'Demo User' }
  };

  // Mock auth methods
  auth = {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      console.log('Mock login:', email);
      return {
        data: { user: this.mockUser, session: { access_token: 'mock-token' } },
        error: null
      };
    },
    
    signUp: async ({ email, password }: { email: string; password: string }) => {
      console.log('Mock signup:', email);
      return {
        data: { user: this.mockUser, session: { access_token: 'mock-token' } },
        error: null
      };
    },
    
    signOut: async () => {
      console.log('Mock signout');
      return { error: null };
    },
    
    getUser: async () => {
      return { data: { user: this.mockUser }, error: null };
    },
    
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simulate logged in state
      setTimeout(() => {
        callback('SIGNED_IN', { user: this.mockUser });
      }, 100);
      
      return {
        data: { subscription: { unsubscribe: () => {} } }
      };
    }
  };

  // Mock database methods
  from(table: string) {
    if (table === 'posts') {
      return {
        select: (columns = '*') => ({
          eq: (column: string, value: any) => ({
            maybeSingle: async () => {
              const post = this.posts.find(p => p[column as keyof MockPost] === value);
              return { data: post || null, error: null };
            },
            single: async () => {
              const post = this.posts.find(p => p[column as keyof MockPost] === value);
              return { data: post || null, error: post ? null : { message: 'Post not found' } };
            }
          }),
          order: (column: string, options?: { ascending?: boolean }) => ({
            then: async () => ({ data: [...this.posts], error: null })
          }),
          then: async () => ({ data: [...this.posts], error: null })
        }),
        
        insert: (data: Partial<MockPost>) => ({
          then: async () => {
            const newPost: MockPost = {
              id: String(Date.now()),
              title: data.title || '',
              slug: data.slug || '',
              content: data.content || '',
              excerpt: data.excerpt || null,
              featured_image: data.featured_image || null,
              category_id: data.category_id || null,
              published: data.published || false,
              published_at: data.published_at || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              author_id: data.author_id || this.mockUser.id
            };
            
            this.posts.push(newPost);
            console.log('Mock: Created post:', newPost);
            return { data: [newPost], error: null };
          }
        }),
        
        update: (data: Partial<MockPost>) => ({
          eq: (column: string, value: any) => ({
            then: async () => {
              const postIndex = this.posts.findIndex(p => p[column as keyof MockPost] === value);
              if (postIndex >= 0) {
                this.posts[postIndex] = {
                  ...this.posts[postIndex],
                  ...data,
                  updated_at: new Date().toISOString()
                };
                console.log('Mock: Updated post:', this.posts[postIndex]);
                return { data: [this.posts[postIndex]], error: null };
              }
              return { data: null, error: { message: 'Post not found' } };
            }
          })
        }),
        
        delete: () => ({
          eq: (column: string, value: any) => ({
            then: async () => {
              const postIndex = this.posts.findIndex(p => p[column as keyof MockPost] === value);
              if (postIndex >= 0) {
                const deletedPost = this.posts.splice(postIndex, 1)[0];
                console.log('Mock: Deleted post:', deletedPost);
                return { data: [deletedPost], error: null };
              }
              return { data: null, error: { message: 'Post not found' } };
            }
          })
        })
      };
    }
    
    if (table === 'categories') {
      return {
        select: (columns = '*') => ({
          order: (column: string, options?: { ascending?: boolean }) => ({
            then: async () => ({ data: [...this.categories], error: null })
          }),
          then: async () => ({ data: [...this.categories], error: null })
        })
      };
    }
    
    return {};
  }
}

export const mockSupabase = new MockSupabase();