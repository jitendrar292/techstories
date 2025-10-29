import { createContext, useContext, useEffect, useState } from 'react';
import { localStorageDB } from '../lib/localStorage';

// Simple user type for localStorage
type User = {
  id: string;
  email: string;
  user_metadata: { full_name: string };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user from localStorage
    const currentUser = localStorageDB.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      const updatedUser = localStorageDB.getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
