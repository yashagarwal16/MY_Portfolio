const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, authRateLimit } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Apply rate limiting to all auth routes
router.use(authRateLimit);

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        
        // Validation
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ 
                message: 'All fields are required',
                fields: { username, email, password: !!password, confirmPassword: !!confirmPassword }
            });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ 
                message: 'Passwords do not match' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }
        
        // Check password strength
        const passwordStrength = checkPasswordStrength(password);
        if (passwordStrength < 2) {
            return res.status(400).json({ 
                message: 'Password is too weak. Please include uppercase, lowercase, numbers, and special characters.' 
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });
        
        if (existingUser) {
            const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
            return res.status(400).json({ 
                message: `${field === 'email' ? 'Email' : 'Username'} already exists`,
                field
            });
        }
        
        // Create new user
        const user = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password
        });
        
        await user.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Store in session
        req.session.token = token;
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation error',
                errors
            });
        }
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                message: `${field === 'email' ? 'Email' : 'Username'} already exists`,
                field
            });
        }
        
        res.status(500).json({ 
            message: 'Server error during registration. Please try again.' 
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }
        
        // Find user and check credentials
        const user = await User.findByCredentials(email.toLowerCase().trim(), password);
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Store in session
        req.session.token = token;
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin,
                preferences: user.preferences
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('locked')) {
            return res.status(423).json({ 
                message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.' 
            });
        }
        
        if (error.message.includes('Invalid login credentials')) {
            return res.status(400).json({ 
                message: 'Invalid email or password' 
            });
        }
        
        res.status(500).json({ 
            message: 'Server error during login. Please try again.' 
        });
    }
});

// Logout user
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ 
                message: 'Could not log out properly' 
            });
        }
        
        res.clearCookie('connect.sid');
        res.json({ 
            message: 'Logout successful',
            redirect: '/signin.html'
        });
    });
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -loginAttempts -lockUntil');
        
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }
        
        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                lastLogin: user.lastLogin,
                preferences: user.preferences,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            message: 'Server error while fetching user data' 
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { username, preferences } = req.body;
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Update allowed fields
        if (username && username !== user.username) {
            // Check if username is already taken
            const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username;
        }
        
        if (preferences) {
            user.preferences = { ...user.preferences, ...preferences };
        }
        
        await user.save();
        
        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                preferences: user.preferences
            }
        });
        
    } catch (error) {
        console.error('Profile update error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation error',
                errors
            });
        }
        
        res.status(500).json({ 
            message: 'Server error while updating profile' 
        });
    }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ 
                message: 'All password fields are required' 
            });
        }
        
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ 
                message: 'New passwords do not match' 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'New password must be at least 6 characters long' 
            });
        }
        
        const user = await User.findById(req.user._id);
        
        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ 
                message: 'Current password is incorrect' 
            });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({ 
            message: 'Password changed successfully' 
        });
        
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            message: 'Server error while changing password' 
        });
    }
});

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Token is valid',
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Helper function to check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    const checks = [
        /.{8,}/, // At least 8 characters
        /[a-z]/, // Lowercase
        /[A-Z]/, // Uppercase
        /[0-9]/, // Numbers
        /[^A-Za-z0-9]/ // Special characters
    ];

    checks.forEach(check => {
        if (check.test(password)) strength++;
    });

    return strength;
}

module.exports = router;