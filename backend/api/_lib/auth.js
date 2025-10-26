// Authentication utilities for JWT token management and password hashing
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key for JWT token generation (from environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

/**
 * Hash a plain text password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

/**
 * Compare plain text password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if passwords match
 */
async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

// Alias for compatibility
const verifyPassword = comparePassword;

/**
 * Generate JWT token for authenticated user
 * @param {object} payload - User data to encode in token (e.g., userId, email)
 * @returns {string} - JWT token
 */
function generateToken(payload) {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
    return token;
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} - Decoded token payload or null if invalid
 */
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        // Token is invalid or expired
        return null;
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    verifyPassword, // Alias
    generateToken,
    verifyToken
};
