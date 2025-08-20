const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const token = req.session.token || 
                     req.headers['authorization']?.split(' ')[1] ||
                     req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Access denied. No token provided.',
                redirect: '/signin.html'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid token. User not found.',
                redirect: '/signin.html'
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(403).json({ 
            message: 'Invalid or expired token.',
            redirect: '/signin.html'
        });
    }
};

// Check if user is authenticated for page access
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/signin.html');
    }
};

// Admin only access
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Rate limiting for auth endpoints
const authRateLimit = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth
    message: {
        message: 'Too many authentication attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    authenticateToken,
    requireAuth,
    requireAdmin,
    authRateLimit
};