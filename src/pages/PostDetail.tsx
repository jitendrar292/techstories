import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post, Comment } from '../lib/types';
import { localStorageDB } from '../lib/localStorage';

export const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchComments();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const foundPost = localStorageDB.getPostBySlug(slug!);
      
      if (!foundPost) {
        navigate('/');
      } else if (foundPost.published) {
        setPost(foundPost);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      navigate('/');
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    // Comments not implemented in localStorage yet
    setComments([]);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setSubmitting(true);
    // Comments not implemented yet
    alert('Comments feature coming soon!');
    setAuthorName('');
    setAuthorEmail('');
    setCommentContent('');
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="container" style={styles.container}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="container" style={styles.container}>
      <article style={styles.article}>
        {post.categories && (
          <span style={styles.category}>{post.categories.name}</span>
        )}
        <h1 style={styles.title}>{post.title}</h1>
        <time style={styles.date}>
          {new Date(post.published_at!).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            style={styles.featuredImage}
          />
        )}
        <div style={styles.content}>{post.content}</div>
      </article>

      <section style={styles.commentsSection}>
        <h2 style={styles.commentsTitle}>Comments ({comments.length})</h2>

        {comments.length > 0 && (
          <div style={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} className="card" style={styles.comment}>
                <div style={styles.commentHeader}>
                  <strong>{comment.author_name}</strong>
                  <time style={styles.commentDate}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </time>
                </div>
                <p style={styles.commentContent}>{comment.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="card" style={styles.commentForm}>
          <h3 style={styles.formTitle}>Leave a Comment</h3>
          <form onSubmit={handleSubmitComment}>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>
                Name *
              </label>
              <input
                id="name"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="comment" style={styles.label}>
                Comment *
              </label>
              <textarea
                id="comment"
                rows={5}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: 'calc(var(--spacing-unit) * 4)',
    paddingBottom: 'calc(var(--spacing-unit) * 8)',
    maxWidth: '800px',
  },
  article: {
    marginBottom: 'calc(var(--spacing-unit) * 8)',
  },
  category: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-primary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: 'calc(var(--spacing-unit) * 2)',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: 'calc(var(--spacing-unit) * 2)',
  },
  date: {
    display: 'block',
    fontSize: '0.875rem',
    color: 'var(--color-text-light)',
    marginBottom: 'calc(var(--spacing-unit) * 4)',
  },
  featuredImage: {
    width: '100%',
    height: 'auto',
    borderRadius: 'calc(var(--spacing-unit) * 1)',
    marginBottom: 'calc(var(--spacing-unit) * 4)',
  },
  content: {
    fontSize: '1.125rem',
    lineHeight: 1.8,
    color: 'var(--color-text)',
    whiteSpace: 'pre-wrap' as const,
  },
  commentsSection: {
    borderTop: '2px solid var(--color-border)',
    paddingTop: 'calc(var(--spacing-unit) * 6)',
  },
  commentsTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: 'calc(var(--spacing-unit) * 4)',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'calc(var(--spacing-unit) * 2)',
    marginBottom: 'calc(var(--spacing-unit) * 4)',
  },
  comment: {
    padding: 'calc(var(--spacing-unit) * 3)',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'calc(var(--spacing-unit) * 1)',
  },
  commentDate: {
    fontSize: '0.875rem',
    color: 'var(--color-text-light)',
  },
  commentContent: {
    lineHeight: 1.6,
    margin: 0,
  },
  commentForm: {
    padding: 'calc(var(--spacing-unit) * 4)',
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: 'calc(var(--spacing-unit) * 3)',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'calc(var(--spacing-unit) * 0.75)',
    marginBottom: 'calc(var(--spacing-unit) * 2)',
  },
  label: {
    fontWeight: 500,
    fontSize: '0.875rem',
  },
};
