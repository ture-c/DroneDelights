const jwt = require("jsonwebtoken");
const User = require("../models/User"); 


const protect = (req, res, next) => {
  if (req.session.userId) {
    req.user = { id: req.session.userId }; 
    next();
  } else {
    res.status(401).json({ msg: "Not authorized, no session" });
  }
};

module.exports = { protect };
