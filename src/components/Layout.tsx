import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DataManager } from './DataManager';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={styles.wrapper}>
      <nav style={styles.nav}>
        <div className="container" style={styles.navContainer}>
          <Link to="/" style={styles.logo}>
            My Real Tech Stories
          </Link>
          <div style={styles.navLinks}>
            {user ? (
              <>
                <Link to="/admin" style={styles.link}>
                  Admin
                </Link>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" style={styles.link}>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main style={styles.main}>{children}</main>
      <footer style={styles.footer}>
        <div className="container">
          <p style={styles.footerText}>© 2025 My Real Tech Stories. All rights reserved.</p>
        </div>
      </footer>
      <DataManager />
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  nav: {
    backgroundColor: 'white',
    borderBottom: '1px solid var(--color-border)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: 'calc(var(--spacing-unit) * 3)',
    alignItems: 'center',
  },
  link: {
    color: 'var(--color-text)',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'color 0.2s ease',
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text)',
    fontWeight: 500,
    fontSize: '1rem',
    cursor: 'pointer',
    padding: 0,
  },
  main: {
    flex: 1,
  },
  footer: {
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid var(--color-border)',
    padding: 'calc(var(--spacing-unit) * 4) 0',
    marginTop: 'calc(var(--spacing-unit) * 8)',
  },
  footerText: {
    textAlign: 'center' as const,
    color: 'var(--color-text-light)',
    margin: 0,
  },
};
