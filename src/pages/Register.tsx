import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { localStorageDB } from '../lib/localStorage';

export const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const username = email.split('@')[0];
      localStorageDB.updateCredentials(username, password, email);
      
      const newUser = {
        id: `local-${Date.now()}`,
        email,
        user_metadata: { full_name: username }
      };
      localStorageDB.setCurrentUser(newUser);
      
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Register</h1>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account?{' '}
          <Link to="/login" style={styles.linkText}>
            Login
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
