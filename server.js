const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable for development
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'http://localhost:3000',
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Authentication middleware for portfolio pages
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/signin.html');
    }
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('🔗 Connected to MongoDB');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: true // Set to false if you want email verification
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.session.token || req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

// Check if user is authenticated (for serving pages)
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/signin.html');
    }
};

// Routes

// Root route - redirect based on auth status
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/index.html');
    } else {
        res.redirect('/signin.html');
    }
});

// Serve authentication pages (only when not authenticated)
app.get('/signin.html', (req, res) => {
    if (req.session.user) {
        return res.redirect('/index.html');
    }
    res.sendFile(path.join(__dirname, 'auth', 'signin.html'));
});

app.get('/signup.html', (req, res) => {
    if (req.session.user) {
        return res.redirect('/index.html');
    }
    res.sendFile(path.join(__dirname, 'auth', 'signup.html'));
});

// Protect all portfolio pages
app.get('/index.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/projec.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'projec.html'));
});

// Protect all Port directory files
app.use('/Port', requireAuth, express.static(path.join(__dirname, 'Port')));

// Protect CSS and JS files for portfolio
app.get('/css/*', requireAuth, (req, res, next) => {
    if (req.path.includes('jarvis.css') || req.path.includes('style.css') || req.path.includes('projects.css')) {
        next();
    } else {
        res.status(404).send('Not Found');
    }
});

app.get('/js/*', requireAuth, (req, res, next) => {
    if (req.path.includes('jarvis.js') || req.path.includes('main.js') || req.path.includes('projects.js')) {
        next();
    } else {
        res.status(404).send('Not Found');
    }
});

// API Routes

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        
        // Validation
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
            });
        }
        
        // Create new user
        const user = new User({
            username,
            email,
            password
        });
        
        await user.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Store in session
        req.session.token = token;
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Store in session
        req.session.token = token;
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
});

module.exports = app;