import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { localStorageDB } from '../lib/localStorage';

export const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      navigate('/admin');
    } else {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Login</h1>
        
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>🔐 Demo Credentials</h3>
          <p style={styles.infoText}>
            <strong>Username:</strong> admin<br />
            <strong>Password:</strong> admin
          </p>
          <p style={styles.infoSubtext}>
            You can also use email: <strong>admin@techstories.com</strong>
          </p>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Username or Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.linkText}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 200px)',
    paddingTop: 'calc(var(--spacing-unit) * 4)',
    paddingBottom: 'calc(var(--spacing-unit) * 8)',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: 'calc(var(--spacing-unit) * 4)',
    textAlign: 'center' as const,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    border: '2px solid #2196f3',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  infoTitle: {
    margin: '0 0 12px 0',
    fontSize: '18px',
    color: '#1565c0',
  },
  infoText: {
    margin: '8px 0',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#0d47a1',
  },
  infoSubtext: {
    margin: '8px 0 0 0',
    fontSize: '13px',
    color: '#1976d2',
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
  label: {
    fontWeight: 500,
    fontSize: '0.875rem',
  },
  link: {
    textAlign: 'center' as const,
    marginTop: 'calc(var(--spacing-unit) * 3)',
    color: 'var(--color-text-light)',
  },
  linkText: {
    color: 'var(--color-primary)',
    textDecoration: 'none',
    fontWeight: 500,
  },
};
