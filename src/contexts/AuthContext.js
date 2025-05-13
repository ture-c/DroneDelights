import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const user = localStorage.getItem('droneDelightsUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      // Check for default user
      if (username === 'user' && password === 'password') {
        const defaultUser = { username: 'user', name: 'Test User' };
        setCurrentUser(defaultUser);
        localStorage.setItem('droneDelightsUser', JSON.stringify(defaultUser));
        return { success: true };
      }
      
      // Check registered users in JSON server
      const response = await fetch(`http://localhost:3001/users?username=${username}`);
      const users = await response.json();
      
      const user = users[0];
      
      if (user && user.password === password) {
        delete user.password; // Don't store password in state
        setCurrentUser(user);
        localStorage.setItem('droneDelightsUser', JSON.stringify(user));
        return { success: true };
      } else {
        return { 
          success: false,
          error: 'Invalid username or password'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false,
        error: 'An error occurred during login'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // Check if username already exists
      const checkResponse = await fetch(`http://localhost:3001/users?username=${userData.username}`);
      const existingUsers = await checkResponse.json();
      
      if (existingUsers.length > 0) {
        return {
          success: false,
          error: 'Username already exists'
        };
      }
      
      // Add new user
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        const newUser = await response.json();
        delete newUser.password; // Don't store password in state
        setCurrentUser(newUser);
        localStorage.setItem('droneDelightsUser', JSON.stringify(newUser));
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Failed to create account'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'An error occurred during registration'
      };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('droneDelightsUser');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
