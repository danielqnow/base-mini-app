import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

type Session = {
  authenticated: boolean;
  provider?: string;
  sub?: string;
};

type AuthContextValue = {
  loading: boolean;
  authenticated: boolean;
  session?: Session;
  login: () => void;
  logout: () => void;
  refresh: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  loading: true,
  authenticated: false,
  login: () => {},
  logout: () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | undefined>(undefined);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/session', { credentials: 'include' });
      const data = await res.json();
      setSession(data);
    } catch {
      setSession({ authenticated: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = useCallback(() => {
    window.location.href = '/api/auth/start';
  }, []);

  const logout = useCallback(() => {
    window.location.href = '/api/auth/logout';
  }, []);

  const value = useMemo(
    () => ({
      loading,
      authenticated: !!session?.authenticated,
      session,
      login,
      logout,
      refresh: fetchSession,
    }),
    [loading, session, login, logout, fetchSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
