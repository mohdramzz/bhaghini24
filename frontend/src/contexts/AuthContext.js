import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login(email, password);
      const { token, id, firstName, lastName, email: userEmail } = response.data;

      const roles = response.data.roles || [];
      
      const userData = { id, firstName, lastName, email: userEmail, roles };
      

      setCurrentUser(userData);
      setToken(token);
      

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      

      console.log("Stored token in localStorage:", token);
      console.log("User data stored:", userData);
      
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const signup = async (firstName, lastName, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      await authApi.signup(firstName, lastName, email, password);
      

      return await login(email, password);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create account. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {

    setCurrentUser(null);
    setToken(null);
    

    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };


  const hasRole = (role) => {
    if (!currentUser || !currentUser.roles) return false;
    return currentUser.roles.includes(role);
  };

  const contextValue = {
    currentUser,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    hasRole,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;