const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  generateToken,
};
