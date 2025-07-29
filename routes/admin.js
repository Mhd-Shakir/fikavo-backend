const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Load environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Admin login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check credentials
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }

  // Invalid login
  res.status(401).json({ message: 'Invalid email or password' });
});

module.exports = router;
