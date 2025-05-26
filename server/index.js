const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Loads .env from C:\Users\turec\DroneDelights\

// --- TEMPORARY DEBUG LOGS ---
console.log("Attempting to load .env variables:");
console.log("MONGODB_URI from env:", process.env.MONGODB_URI);
console.log("SESSION_SECRET from env:", process.env.SESSION_SECRET);
console.log("PORT from env:", process.env.PORT);
// --- END TEMPORARY DEBUG LOGS ---

const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/users"); // Assuming your user routes are here

const app = express();

// CORS configuration MUST be correct and ideally placed early
app.use(
  cors({
    origin: "http://localhost:3000", // Your React app's URL
    credentials: true, // IMPORTANT for sending/receiving cookies for session management
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow common methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allow common headers
  })
);

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration (ensure this is also correct)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax", // 'lax' is often a good default. 'none' requires secure.
    },
  })
);

// Routes
app.use("/api/users", userRoutes); // Mount your user routes

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
