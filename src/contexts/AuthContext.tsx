import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
    // Get initial user
    supabase.auth.getUser().then((result) => {
      if (result.data?.user) {
        setUser(result.data.user as User);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as User || null);
    });

    return () => {
      if (subscription?.data?.subscription?.unsubscribe) {
        subscription.data.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
