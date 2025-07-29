const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🛑 Make sure your token payload matches this structure:
    // e.g., jwt.sign({ id: admin._id }, JWT_SECRET)
    req.admin = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
