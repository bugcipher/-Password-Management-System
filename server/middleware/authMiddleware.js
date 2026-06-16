const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_token_key_for_pwd_manager_777';

/**
 * Middleware to protect routes and verify JWT tokens
 */
function authMiddleware(req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    // Check if no header or doesn't start with Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Add user info from payload to request object
        req.user = decoded;
        
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        res.status(401).json({ message: 'Token is not valid or has expired' });
    }
}

module.exports = authMiddleware;
