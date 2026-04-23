const jwt = require('jsonwebtoken');

/**
 * Auth Middleware — protects routes that require a logged-in user.
 * Reads the Bearer token from the Authorization header,
 * verifies it using JWT_SECRET, and attaches the decoded payload to req.user.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check that the header exists and follows "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token — throws if expired or tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: userId }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
