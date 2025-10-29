import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../lib/types';
import { localStorageDB } from '../lib/localStorage';

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log('🏠 Home: Fetching posts...');
    try {
      const allPosts = localStorageDB.getPosts();
      // Filter for published posts only
      const publishedPosts = allPosts.filter(post => post.published);
      console.log('🏠 Home: Published posts:', publishedPosts.length, publishedPosts);
      setPosts(publishedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container" style={styles.container}>
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container" style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to My Blog</h1>
        <p style={styles.heroSubtitle}>
          Discover stories, insights, and ideas
        </p>
      </div>

      <div style={styles.contentWrapper}>
        {/* Main Content */}
        <main style={styles.mainContent}>
          <div style={styles.posts}>
            {posts.length === 0 ? (
              <div style={styles.empty}>
                <p>No posts published yet. Check back soon!</p>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} style={styles.postCard}>
                  <div style={styles.postContent}>
                    <h2 style={styles.postTitle}>
                      {post.title}
                    </h2>
                    {post.excerpt && <p style={styles.excerpt}>{post.excerpt}</p>}
                    <div style={styles.postFooter}>
                      <time style={styles.date}>
                        {new Date(post.published_at!).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <Link to={`/post/${post.slug}`} style={styles.readMoreBtn}>
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </main>

        {/* Sidebar - Right Side */}
        <aside style={styles.sidebar}>
          {/* About Section */}
          <div className="card" style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>About Me</h3>
            <p style={styles.sidebarText}>
              <strong>Jitendra Rawat</strong><br />
              Senior Software Engineer @ Adidas<br /><br />
              Passionate about building secure, scalable systems and leveraging AI/ML to solve real-world problems in cybersecurity and digital ecosystems.
            </p>
          </div>

          {/* Recent Posts */}
          <div className="card" style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Recent Posts</h3>
            <ul style={styles.recentPostsList}>
              {posts.slice(0, 5).map((post) => (
                <li key={post.id} style={styles.recentPostItem}>
                  <Link to={`/post/${post.slug}`} style={styles.recentPostLink}>
                    {post.title}
                  </Link>
                  <time style={styles.recentPostDate}>
                    {new Date(post.published_at!).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="card" style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Categories</h3>
            <div style={styles.categoryList}>
              <span style={styles.categoryTag}>Technology</span>
              <span style={styles.categoryTag}>Programming</span>
              <span style={styles.categoryTag}>Career</span>
              <span style={styles.categoryTag}>AI & ML</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="card" style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>Connect</h3>
            <div style={styles.socialLinks}>
              <a href="https://github.com/jitendrar292" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>GitHub</a>
              <a href="https://www.linkedin.com/in/jitendrar-singh-rawat/" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>LinkedIn</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: 'calc(var(--spacing-unit) * 4)',
    paddingBottom: 'calc(var(--spacing-unit) * 8)',
  },
  hero: {
    textAlign: 'center' as const,
    marginBottom: 'calc(var(--spacing-unit) * 6)',
    paddingTop: 'calc(var(--spacing-unit) * 4)',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 700,
    marginBottom: 'calc(var(--spacing-unit) * 2)',
    lineHeight: 1.2,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto',
  },
  contentWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: 'calc(var(--spacing-unit) * 6)',
  },
  mainContent: {
    minWidth: 0,
  },
  posts: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'calc(var(--spacing-unit) * 4)',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'calc(var(--spacing-unit) * 3)',
  },
  sidebarCard: {
    padding: 'calc(var(--spacing-unit) * 3)',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
    borderLeft: '4px solid transparent',
    borderImage: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    borderImageSlice: 1,
  },
  sidebarTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: 'calc(var(--spacing-unit) * 2)',
    borderBottom: '3px solid transparent',
    borderImage: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderImageSlice: 1,
    paddingBottom: 'calc(var(--spacing-unit) * 1)',
    color: '#1f2937',
  },
  sidebarText: {
    color: 'var(--color-text-light)',
    lineHeight: 1.6,
    fontSize: '0.9rem',
  },
  recentPostsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  recentPostItem: {
    marginBottom: 'calc(var(--spacing-unit) * 2)',
    paddingBottom: 'calc(var(--spacing-unit) * 2)',
    borderBottom: '1px solid var(--color-border)',
  },
  recentPostLink: {
    color: 'var(--color-text)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    display: 'block',
    marginBottom: 'calc(var(--spacing-unit) * 0.5)',
    transition: 'color 0.2s ease',
  },
  recentPostDate: {
    fontSize: '0.75rem',
    color: 'var(--color-text-light)',
  },
  categoryList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'calc(var(--spacing-unit) * 1)',
  },
  categoryTag: {
    display: 'inline-block',
    padding: 'calc(var(--spacing-unit) * 0.5) calc(var(--spacing-unit) * 1.5)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    borderRadius: '20px',
    fontSize: '0.8rem',
    textDecoration: 'none',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)',
  },
  socialLinks: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'calc(var(--spacing-unit) * 1)',
  },
  socialLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    padding: 'calc(var(--spacing-unit) * 1)',
    borderRadius: '8px',
    background: 'rgba(102, 126, 234, 0.05)',
    display: 'block',
  },
  empty: {
    textAlign: 'center' as const,
    padding: 'calc(var(--spacing-unit) * 8) 0',
    color: 'var(--color-text-light)',
  },
  postCard: {
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 'calc(var(--spacing-unit) * 4)',
    marginBottom: 'calc(var(--spacing-unit) * 4)',
    transition: 'transform 0.2s ease',
  },
  postImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  postContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'calc(var(--spacing-unit) * 2)',
  },
  category: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-primary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: 'calc(var(--spacing-unit) * 1)',
  },
  postTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    lineHeight: 1.3,
    color: '#1f2937',
    margin: 0,
  },
  postLink: {
    color: '#1f2937',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  excerpt: {
    color: '#6b7280',
    lineHeight: 1.7,
    fontSize: '1rem',
    margin: 0,
  },
  postFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 'calc(var(--spacing-unit) * 1)',
  },
  postMeta: {
    display: 'flex',
    gap: 'calc(var(--spacing-unit) * 2)',
    alignItems: 'center',
  },
  date: {
    fontSize: '0.875rem',
    color: '#9ca3af',
  },
  readMoreBtn: {
    color: '#ffffff',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: 'calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 3)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
  },
};
