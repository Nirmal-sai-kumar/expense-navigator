// Middleware functions for authentication and authorization
const { verifyToken } = require('./auth');

/**
 * Middleware to check if user is authenticated
 * Verifies JWT token from cookies or Authorization header
 */
function requireAuth(req, res, next) {
    try {
        // Try to get token from cookie first
        let token = req.cookies?.token;
        
        // If not in cookie, check Authorization header
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
            }
        }
        
        // If no token found, user is not authenticated
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Please login first.'
            });
        }
        
        // Verify token
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please login again.'
            });
        }
        
        // Attach user info to request object for use in route handlers
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication error occurred.'
        });
    }
}

/**
 * Middleware to check if user has admin role
 * Should be used after requireAuth middleware
 */
function requireAdmin(req, res, next) {
    try {
        // Check if user object exists (from requireAuth middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }
        
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        
        next();
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error occurred.'
        });
    }
}

module.exports = {
    requireAuth,
    requireAdmin
};
