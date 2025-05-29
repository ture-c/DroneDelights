const express = require("express"); // Se till att express är importerat
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./.env" }); // This will load from server/.env

// Debug
console.log("Attempting to load .env variables:");
console.log("MONGODB_URI from env:", process.env.MONGODB_URI);
console.log("SESSION_SECRET from env:", process.env.SESSION_SECRET);
console.log("PORT from env:", process.env.PORT);

const session = require("express-session");
const MongoStore = require("connect-mongo");

// Route imports
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const productRoutes = require("./routes/products"); // <<< LÄGG TILL DENNA RAD

const app = express();

// CORS configuration MUST be correct and ideally placed early
app.use(
  cors({
    origin: "http://localhost:3000", // React app url
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allow common headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, 
      autoRemove: "native", 
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true, 
      maxAge: 1000 * 60 * 60 * 24 * 7, 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    },
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes); // Denna rad kommer nu att fungera
app.use("/api/orders", orderRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("DroneDelights API Running!");
});

// Connect to MongoDB start server
const PORT = 5001; 

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
