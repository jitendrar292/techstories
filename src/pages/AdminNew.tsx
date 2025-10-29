import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { localStorageDB } from '../lib/localStorage';
import { StorageStatus } from '../components/StorageStatus';

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

export const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const allPosts = localStorageDB.getPosts();
      setPosts(allPosts as Post[]);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
    setLoading(false);
  };

  const deletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      localStorageDB.deletePost(postId);
      alert('Post deleted successfully!');
      fetchPosts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  if (authLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <div style={styles.loading}>Please log in to access the admin panel.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <button
          onClick={() => navigate('/admin/new-post')}
          style={styles.createButton}
        >
          ✍️ Create New Post
        </button>
      </div>

      <StorageStatus />

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📝 Your Posts ({posts.length})</h2>
        
        {loading ? (
          <div style={styles.loading}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No posts yet. Create your first post!</p>
            <button 
              onClick={() => navigate('/admin/new-post')}
              style={styles.createButton}
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div style={styles.postsList}>
            {posts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                <div style={styles.postHeader}>
                  <h3 style={styles.postTitle}>{post.title}</h3>
                  <div style={styles.postStatus}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: post.published ? '#28a745' : '#ffc107',
                      color: post.published ? 'white' : '#212529'
                    }}>
                      {post.published ? '✅ Published' : '📝 Draft'}
                    </span>
                  </div>
                </div>
                
                <div style={styles.postMeta}>
                  <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                  <span>🔗 /{post.slug}</span>
                </div>
                
                {post.excerpt && (
                  <p style={styles.postExcerpt}>{post.excerpt}</p>
                )}
                
                <div style={styles.postActions}>
                  <button
                    onClick={() => navigate(`/admin/edit-post/${post.id}`)}
                    style={styles.editButton}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => window.open(`/post/${post.slug}`, '_blank')}
                    style={styles.viewButton}
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    style={styles.deleteButton}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.tips}>
        <h3>💡 Quick Tips</h3>
        <ul>
          <li>Use the 💾 button (bottom-right) to export/import your data</li>
          <li>All data is stored locally in your browser</li>
          <li>Create engaging content with markdown formatting</li>
          <li>Published posts are visible on your homepage</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #eee',
  },
  title: {
    fontSize: '32px',
    margin: '0',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px dashed #dee2e6',
  },
  postsList: {
    display: 'grid',
    gap: '20px',
  },
  postCard: {
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  postTitle: {
    fontSize: '20px',
    margin: '0',
    color: '#333',
    flex: '1',
  },
  postStatus: {
    marginLeft: '16px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  postMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },
  postExcerpt: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '16px',
  },
  postActions: {
    display: 'flex',
    gap: '12px',
  },
  editButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  viewButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tips: {
    backgroundColor: '#e7f3ff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #b3d7ff',
  },
};