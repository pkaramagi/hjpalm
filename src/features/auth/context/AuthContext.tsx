import { createContext, useContext, useEffect, type PropsWithChildren } from 'react';

import { type UseAuthReturn, useAuth } from '../hooks/useAuth';

const AuthContext = createContext<UseAuthReturn | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const auth = useAuth();
  // Effect to handle token expiration
  useEffect(() => {
    if (!auth.isLoggedIn()) {
      auth.logout();
    }
  }, [auth, auth.isLoggedIn, auth.logout]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

