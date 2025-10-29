// Storage adapter that provides Supabase-like API using localStorage
import { localStorageDB } from './localStorage';

class LocalStorageAdapter {
  // Default user for demo purposes
  private defaultUser = {
    id: 'local-user',
    email: 'demo@techstories.com',
    user_metadata: { full_name: 'Tech Stories Author' }
  };

  // Store auth state change listeners
  private authListeners: Array<(event: string, session: any) => void> = [];

  // Auth methods
  auth = {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      console.log('🔐 Local auth - signing in with:', email);
      
      // Check if credentials are valid (using email as username or actual username)
      const credentials = localStorageDB.getCredentials();
      const isValid = localStorageDB.validateCredentials(email, password) || 
                      (credentials && credentials.email === email && localStorageDB.validateCredentials(credentials.username, password));
      
      if (isValid) {
        const creds = localStorageDB.getCredentials();
        const user = {
          id: 'local-user',
          email: creds?.email || email,
          user_metadata: { full_name: creds?.username || 'Admin User' }
        };
        localStorageDB.setCurrentUser(user);
        
        // Notify all listeners of auth state change
        this.authListeners.forEach(listener => {
          listener('SIGNED_IN', { user });
        });
        
        return {
          data: { user, session: { access_token: 'local-token' } },
          error: null
        };
      }
      
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid username or password' }
      };
    },
    
    signUp: async ({ email, password }: { email: string; password: string }) => {
      console.log('📝 Local auth - signing up:', email);
      
      // For demo purposes, update credentials with new user
      const username = email.split('@')[0];
      localStorageDB.updateCredentials(username, password, email);
      
      const newUser = {
        id: `local-${Date.now()}`,
        email,
        user_metadata: { full_name: username }
      };
      localStorageDB.setCurrentUser(newUser);
      
      // Notify all listeners of auth state change
      this.authListeners.forEach(listener => {
        listener('SIGNED_IN', { user: newUser });
      });
      
      return {
        data: { user: newUser, session: { access_token: 'local-token' } },
        error: null
      };
    },
    
    signOut: async () => {
      console.log('👋 Local auth - signing out');
      localStorageDB.setCurrentUser(null);
      
      // Notify all listeners of auth state change
      this.authListeners.forEach(listener => {
        listener('SIGNED_OUT', null);
      });
      
      return { error: null };
    },
    
    getUser: async () => {
      const user = localStorageDB.getCurrentUser();
      return { data: { user }, error: null };
    },
    
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Store the listener
      this.authListeners.push(callback);
      
      // Simulate auth state on initialization
      setTimeout(() => {
        const user = localStorageDB.getCurrentUser();
        if (user) {
          callback('SIGNED_IN', { user });
        } else {
          callback('SIGNED_OUT', null);
        }
      }, 100);
      
      return {
        data: { 
          subscription: { 
            unsubscribe: () => {
              const index = this.authListeners.indexOf(callback);
              if (index > -1) {
                this.authListeners.splice(index, 1);
              }
            } 
          } 
        }
      };
    }
  };

  // Database methods
  from(table: string) {
    if (table === 'posts') {
      return {
        select: (_columns = '*') => {
          const self = {
            eq: (column: string, value: any) => ({
              maybeSingle: async () => {
                if (column === 'id') {
                  const post = localStorageDB.getPost(value);
                  return { data: post, error: null };
                }
                if (column === 'slug') {
                  const post = localStorageDB.getPostBySlug(value);
                  return { data: post, error: null };
                }
                return { data: null, error: null };
              },
              single: async () => {
                if (column === 'id') {
                  const post = localStorageDB.getPost(value);
                  return { 
                    data: post, 
                    error: post ? null : { message: 'Post not found' } 
                  };
                }
                if (column === 'slug') {
                  const post = localStorageDB.getPostBySlug(value);
                  return { 
                    data: post, 
                    error: post ? null : { message: 'Post not found' } 
                  };
                }
                return { data: null, error: { message: 'Post not found' } };
              },
              then: async () => {
                const posts = localStorageDB.getPosts();
                const filtered = posts.filter((p: any) => p[column] === value);
                return { data: filtered, error: null };
              }
            }),
            order: (_column: string, _options?: { ascending?: boolean }) => ({
              then: async () => {
                let posts = localStorageDB.getPosts();
                // Sort by created_at descending by default
                posts.sort((a, b) => {
                  const dateA = new Date(a.created_at).getTime();
                  const dateB = new Date(b.created_at).getTime();
                  return dateB - dateA;
                });
                return { data: posts, error: null };
              }
            }),
            then: async () => {
              const posts = localStorageDB.getPosts();
              return { data: posts, error: null };
            }
          };
          return self;
        },
        
        insert: (data: any) => ({
          then: async () => {
            try {
              const newPost = localStorageDB.createPost(data);
              return { data: [newPost], error: null };
            } catch (error: any) {
              return { data: null, error: { message: error.message } };
            }
          }
        }),
        
        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            then: async () => {
              try {
                if (column === 'id') {
                  const updatedPost = localStorageDB.updatePost(value, data);
                  if (updatedPost) {
                    return { data: [updatedPost], error: null };
                  }
                  return { data: null, error: { message: 'Post not found' } };
                }
                return { data: null, error: { message: 'Invalid update criteria' } };
              } catch (error: any) {
                return { data: null, error: { message: error.message } };
              }
            }
          })
        }),
        
        delete: () => ({
          eq: (column: string, value: any) => ({
            then: async () => {
              try {
                if (column === 'id') {
                  const success = localStorageDB.deletePost(value);
                  if (success) {
                    return { data: [], error: null };
                  }
                  return { data: null, error: { message: 'Post not found' } };
                }
                return { data: null, error: { message: 'Invalid delete criteria' } };
              } catch (error: any) {
                return { data: null, error: { message: error.message } };
              }
            }
          })
        })
      };
    }
    
    if (table === 'categories') {
      return {
        select: (columns = '*') => ({
          order: (column: string, options?: { ascending?: boolean }) => ({
            then: async () => {
              let categories = localStorageDB.getCategories();
              if (column === 'name') {
                categories.sort((a, b) => {
                  return options?.ascending 
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
                });
              }
              return { data: categories, error: null };
            }
          }),
          then: async () => {
            const categories = localStorageDB.getCategories();
            return { data: categories, error: null };
          }
        })
      };
    }
    
    return {};
  }

  // Utility methods
  exportData() {
    return localStorageDB.exportData();
  }

  importData(jsonData: string) {
    return localStorageDB.importData(jsonData);
  }

  clearAllData() {
    localStorageDB.clearAllData();
  }
}

export const localStorageAdapter = new LocalStorageAdapter();