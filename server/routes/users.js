const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Assuming you have a User model

// Register User
router.post("/register", async (req, res) => {
  const { username, email, password, name /*, address */ } = req.body; // 'name' and 'address' are extra

  // Basic validation (you have some on frontend, backend should always validate too)
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter all required fields" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Password must be at least 6 characters",
      });
  }
  // You might add validation for 'name' if it's required for some other purpose

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists with this email" });
    }
    user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "Username is already taken" });
    }

    // Create user with only schema-defined fields
    user = new User({
      username,
      email,
      password,
      // If you want to store 'name', you MUST add it to your User.js schema
      // name: name, // This would require 'name' to be in UserSchema
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Log the user in by setting up the session (as per previous session setup)
    req.session.userId = user.id;
    req.session.username = user.username;

    // Send back user info MINUS password, and a success flag
    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        // name: user.name // if 'name' was saved
      },
      msg: "Registration successful, user logged in.",
    });
  } catch (err) {
    console.error("Register Error:", err.message); // Log the actual error on the server
    // Check for MongoDB duplicate key errors (code 11000)
    if (err.code === 11000) {
      if (err.keyPattern && err.keyPattern.email) {
        return res
          .status(400)
          .json({ success: false, error: "Email already exists." });
      }
      if (err.keyPattern && err.keyPattern.username) {
        return res
          .status(400)
          .json({ success: false, error: "Username already exists." });
      }
      return res
        .status(400)
        .json({ success: false, error: "Duplicate field value." });
    }
    res
      .status(500)
      .json({ success: false, error: "Server error during registration" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Set up the session
    req.session.userId = user.id; // or user._id
    req.session.username = user.username;

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      msg: "Login successful",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error during login");
  }
});

// Logout User
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res
        .status(500)
        .json({ msg: "Could not log out, please try again." });
    }
    // Optional: Clear the cookie on the client-side, though httpOnly makes it server-controlled
    // res.clearCookie('connect.sid'); // 'connect.sid' is the default session cookie name
    res.status(200).json({ msg: "Logout successful" });
  });
});

// Check current user session (useful for frontend to know if user is logged in)
router.get("/me", (req, res) => {
  if (req.session.userId) {
    return res.json({
      id: req.session.userId,
      username: req.session.username,
      // You might want to fetch full user details from DB here if needed
      // const user = await User.findById(req.session.userId).select('-password');
      // return res.json(user);
    });
  } else {
    return res.status(401).json({ msg: "Not authenticated" });
  }
});

module.exports = router;
