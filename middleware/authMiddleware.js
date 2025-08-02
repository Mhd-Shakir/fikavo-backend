const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // ✅ Extracts just the token part

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verification step
    req.admin = decoded; // Optional: store admin info for later
    next(); // ✅ Passes control to the actual route
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
