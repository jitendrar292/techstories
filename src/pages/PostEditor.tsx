import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Category } from '../lib/types';
import { localStorageDB } from '../lib/localStorage';

export const PostEditor = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const isEditing = !!postId;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchCategories();
    if (isEditing && postId) {
      fetchPost();
    }
  }, [postId, isEditing]);

  const fetchCategories = async () => {
    const data = localStorageDB.getCategories();
    setCategories(data);
  };

  const fetchPost = async () => {
    try {
      const data = localStorageDB.getPost(postId!);
      
      if (!data) {
        alert('Failed to load post');
        navigate('/admin');
      } else {
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
        setExcerpt(data.excerpt || '');
        setFeaturedImage(data.featured_image || '');
        setCategoryId(data.category_id || '');
        setPublished(data.published);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load post');
      navigate('/admin');
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        localStorageDB.updatePost(postId!, {
          title,
          slug,
          content,
          excerpt: excerpt || null,
          featured_image: featuredImage || null,
          category_id: categoryId || null,
          published,
          published_at: published ? new Date().toISOString() : null,
        });
        alert('Post updated successfully!');
      } else {
        localStorageDB.createPost({
          title,
          slug,
          content,
          excerpt: excerpt || null,
          featured_image: featuredImage || null,
          category_id: categoryId || null,
          published,
          published_at: published ? new Date().toISOString() : null,
          author_id: user.id,
        });
        alert('Post created successfully!');
      }
      navigate('/admin');
    } catch (err: any) {
      console.error('Error saving post:', err);
      setError(err.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
        <button onClick={() => navigate('/admin')} style={styles.backButton}>
          ← Back to Admin
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="slug" style={styles.label}>
            Slug *
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <span style={styles.helpText}>
            URL-friendly version of the title
          </span>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label htmlFor="category" style={styles.label}>
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={styles.select}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="featured-image" style={styles.label}>
              Featured Image URL
            </label>
            <input
              id="featured-image"
              type="url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="excerpt" style={styles.label}>
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A brief summary of your post..."
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="content" style={styles.label}>
            Content *
          </label>
          <textarea
            id="content"
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div style={styles.checkboxGroup}>
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor="published" style={styles.checkboxLabel}>
            Publish this post
          </label>
        </div>

        <div style={styles.actions}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: 'calc(var(--spacing-unit) * 4)',
    paddingBottom: 'calc(var(--spacing-unit) * 8)',
    maxWidth: '900px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'calc(var(--spacing-unit) * 4)',
  },
  title: {
    fontSize: '2.5rem',
    margin: 0,
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  error: {
    padding: 'calc(var(--spacing-unit) * 1.5)',
    backgroundColor: '#fee2e2',
    color: 'var(--color-error)',
    borderRadius: 'calc(var(--spacing-unit) * 0.75)',
    marginBottom: 'calc(var(--spacing-unit) * 3)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'calc(var(--spacing-unit) * 3)',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'calc(var(--spacing-unit) * 0.75)',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'calc(var(--spacing-unit) * 2)',
  },
  label: {
    fontWeight: 500,
    fontSize: '0.875rem',
  },
  helpText: {
    fontSize: '0.75rem',
    color: 'var(--color-text-light)',
  },
  select: {
    padding: 'calc(var(--spacing-unit) * 1.5)',
    borderRadius: 'calc(var(--spacing-unit) * 0.75)',
    border: '1px solid var(--color-border)',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 'calc(var(--spacing-unit) * 1)',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: 'calc(var(--spacing-unit) * 2)',
    paddingTop: 'calc(var(--spacing-unit) * 2)',
  },
  cancelButton: {
    padding: 'calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 3)',
    border: '1px solid var(--color-border)',
    borderRadius: 'calc(var(--spacing-unit) * 0.75)',
    background: 'white',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
};
