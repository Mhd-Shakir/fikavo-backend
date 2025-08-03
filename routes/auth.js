const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  // Generate token
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ success: true, token });
});

module.exports = router;
