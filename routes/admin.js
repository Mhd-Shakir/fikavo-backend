const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Load environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // ✅ 1. Validate inputs
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  // ✅ 2. Match credentials
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // ✅ 3. Sign token with minimal payload
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  }

  // ❌ Invalid credentials
  res.status(401).json({ success: false, message: 'Invalid email or password' });
});

module.exports = router;
