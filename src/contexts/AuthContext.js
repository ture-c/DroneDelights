import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Hanterar laddningstillståndet för autentisering

  // Se om användaren är inloggad genom att skicka en begäran till servern
  const checkLoginStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/users/me", {
        withCredentials: true, //kakor
      });
      if (response.data && response.data.id) {
        setCurrentUser(response.data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error(
        "Inte autentiserad eller fel vid kontroll av status:",
        error.response ? error.response.data : error.message
      );
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/login",
        { email, password },
        {
          withCredentials: true,
        }
      );
      setCurrentUser(response.data); // Servern bör returnera användarinfo vid lyckad inloggning
      // setLoading(false);
      return response.data; 
    } catch (error) {
      // setLoading(false);
      console.error(
        "Inloggning misslyckades:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const register = async (userData) => {
    // setLoading(true);
    try {
      // userData här är { username, email, password, name, address }
      const response = await axios.post(
        "http://localhost:5001/api/users/register",
        userData,
        {
          withCredentials: true, // VIKTIGT
        }
      );
      setCurrentUser(response.data); // Servern bör returnera användarinfo och logga in dem
      // setLoading(false);
      return response.data;
    } catch (error) {
      // setLoading(false);
      console.error(
        "Registrering misslyckades:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const logout = async () => {
    // setLoading(true);
    try {
      await axios.post(
        "http://localhost:5001/api/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setCurrentUser(null);
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.error(
        "Utloggning misslyckades:",
        error.response ? error.response.data : error.message
      );
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    setCurrentUser, 
    login,
    register,
    logout,
    loadingAuth: loading, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
