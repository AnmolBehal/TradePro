const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user ID to request object
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      message: 'Invalid token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = authMiddleware;