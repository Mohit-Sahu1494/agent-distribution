const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for an admin
 * @param {string} id - MongoDB ObjectId of the admin
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = { generateToken };
