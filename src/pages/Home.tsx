import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Post } from '../lib/supabase';

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log('🏠 Home: Fetching posts...');
    try {
      const result = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .then();

      console.log('🏠 Home: Posts result:', result);
      
      if (result.error) {
        console.error('Error fetching posts:', result.error);
      } else if (result.data) {
        // Filter for published posts only
        const publishedPosts = (result.data as Post[]).filter(post => post.published);
        console.log('🏠 Home: Published posts:', publishedPosts.length, publishedPosts);
        setPosts(publishedPosts);
      }
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

      <div style={styles.posts}>
        {posts.length === 0 ? (
          <div style={styles.empty}>
            <p>No posts published yet. Check back soon!</p>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="card" style={styles.postCard}>
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  style={styles.postImage}
                />
              )}
              <div style={styles.postContent}>
                <h2 style={styles.postTitle}>
                  <Link to={`/post/${post.slug}`} style={styles.postLink}>
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && <p style={styles.excerpt}>{post.excerpt}</p>}
                <div style={styles.postMeta}>
                  <time style={styles.date}>
                    {new Date(post.published_at!).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </article>
          ))
        )}
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
    marginBottom: 'calc(var(--spacing-unit) * 8)',
    paddingTop: 'calc(var(--spacing-unit) * 4)',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 700,
    marginBottom: 'calc(var(--spacing-unit) * 2)',
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: 'var(--color-text-light)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  posts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: 'calc(var(--spacing-unit) * 4)',
  },
  empty: {
    textAlign: 'center' as const,
    padding: 'calc(var(--spacing-unit) * 8) 0',
    color: 'var(--color-text-light)',
    gridColumn: '1 / -1',
  },
  postCard: {
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  postImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
  },
  postContent: {
    padding: 'calc(var(--spacing-unit) * 3)',
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
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: 'calc(var(--spacing-unit) * 2)',
    lineHeight: 1.3,
  },
  postLink: {
    color: 'var(--color-text)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  excerpt: {
    color: 'var(--color-text-light)',
    lineHeight: 1.6,
    marginBottom: 'calc(var(--spacing-unit) * 2)',
  },
  postMeta: {
    display: 'flex',
    gap: 'calc(var(--spacing-unit) * 2)',
    alignItems: 'center',
  },
  date: {
    fontSize: '0.875rem',
    color: 'var(--color-text-light)',
  },
};
