import { supabase } from '@/utils/supabase-config';
import { AuthResponse, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => Promise.resolve({ error: null, data: { user: null, session: null } })
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: React.ReactNode;
};

const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setAuth(true);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user, login }}>{children}</AuthContext.Provider>;
}
