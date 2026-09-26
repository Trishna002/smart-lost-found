import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if a token exists and fetch the current user
 useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return; // nothing to verify, skip the API call
    }
    try {
      const { data } = await axiosInstance.get('/auth/me');
      setUser(data);
    } catch (error) {
      localStorage.removeItem('token');
    }
    setLoading(false);
  };
  initAuth();
}, []);

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axiosInstance.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access anywhere in the app
export const useAuth = () => useContext(AuthContext);