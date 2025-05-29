import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

const fetchUserData = async () => {
  try {
    const response = await axios.get("http://localhost:5001/api/users/me", {
      withCredentials: true, // THIS IS ESSENTIAL
    });
    console.log("User data from index.js fetch:", response.data); // Lade till en mer beskrivande logg
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("No user currently logged in (checked from index.js).");
    } else {
      console.error("Error fetching user data from index.js:", error);
    }
  }
};

fetchUserData();

reportWebVitals();
