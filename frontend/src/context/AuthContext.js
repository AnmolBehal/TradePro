import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setCurrentUser(response.data.user); // Access user from response.data.user
          setLoading(false);
        })
        .catch(err => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
  };
  
  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Remove the duplicated useEffect that was outside the component