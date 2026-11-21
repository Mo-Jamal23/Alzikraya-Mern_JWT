import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, getStoredUser, storeSession, clearSession } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore the session only if a token is still stored
  const [user, setUser] = useState(getToken() ? getStoredUser() : null);

  // Called with the { token, user } response of register/login
  const login = ({ token, user: profile }) => {
    storeSession(token, profile);
    setUser(profile);
  };

  // Logout simply clears the stored token and user
  const logout = () => {
    clearSession();
    setUser(null);
  };

  // The API interceptor fires this event when the token expires
  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
