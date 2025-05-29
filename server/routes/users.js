const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User"); 
const { protect } = require("../middleware/authMiddleware"); 

router.post("/register", async (req, res) => {
  const { username, email, password, name /*, address */ } = req.body; // 'name' and 'address' are extra

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter all required fields" });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters",
    });
  }

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

    user = new User({
      username,
      email,
      password,
      
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    req.session.userId = user.id;
    req.session.username = user.username;

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        
      },
      msg: "Registration successful, user logged in.",
    });
  } catch (err) {
    console.error("Register Error:", err.message); 
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
    
    res.status(200).json({ msg: "Logout successful" });
  });
});

router.get("/me", (req, res) => {
  if (req.session.userId) {
    return res.json({
      id: req.session.userId,
      username: req.session.username,
      
    });
  } else {
    return res.status(401).json({ msg: "Not authenticated" });
  }
});

// Kanske ha favorites om jag får tid



module.exports = router;
