import { createContext, useContext, useState } from 'react';
import { getStoredUser, storeUser, clearStoredUser } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());

  const login = (profile) => {
    storeUser(profile);
    setUser(profile);
  };
  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
