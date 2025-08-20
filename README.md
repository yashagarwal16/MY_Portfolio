# JARVIS Portfolio with Authentication

A futuristic AI-themed portfolio website with MongoDB authentication system.

## Features

### Authentication System
- **User Registration & Login**: Secure user authentication with MongoDB
- **Session Management**: Express sessions with MongoDB store
- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Account Locking**: Temporary lockout after failed attempts

### Portfolio Features
- **JARVIS-themed Interface**: Futuristic AI assistant design
- **Interactive Elements**: Hover effects, animations, and transitions
- **Project Showcase**: Comprehensive project database
- **Responsive Design**: Mobile-first responsive layout
- **Matrix Background**: Animated matrix rain effect
- **Voice Commands**: Speech recognition for navigation (modern browsers)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-auth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `portfolio_auth`

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio_auth
   JWT_SECRET=your_super_secret_jwt_key_here
   SESSION_SECRET=your_super_secret_session_key_here
   PORT=3000
   NODE_ENV=development
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - You'll be redirected to the sign-in page
   - Create a new account or sign in with existing credentials

## Project Structure

```
portfolio-auth/
├── auth/                   # Authentication pages
│   ├── signin.html        # Sign in page
│   └── signup.html        # Sign up page
├── css/                   # Stylesheets
│   ├── jarvis.css        # Main JARVIS theme
│   ├── style.css         # Base styles
│   └── projects.css      # Projects page styles
├── js/                    # JavaScript files
│   ├── jarvis.js         # Main JARVIS functionality
│   ├── main.js           # Core application logic
│   └── projects.js       # Projects page logic
├── middleware/            # Express middleware
│   └── auth.js           # Authentication middleware
├── models/               # MongoDB models
│   └── User.js           # User model
├── public/               # Static assets
│   └── js/
│       └── auth.js       # Client-side auth logic
├── routes/               # Express routes
│   └── auth.js           # Authentication routes
├── Port/                 # Original portfolio files
├── server.js             # Main server file
├── package.json          # Dependencies
├── .env                  # Environment variables
└── README.md             # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify` - Verify token
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Protected Routes
- `GET /` - Redirects to signin or portfolio
- `GET /index.html` - Main portfolio (requires auth)
- `GET /projec.html` - Projects page (requires auth)

## Security Features

1. **Password Hashing**: Bcrypt with 12 salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Session Management**: Express sessions with MongoDB store
4. **Rate Limiting**: 5 attempts per 15 minutes for auth endpoints
5. **Account Locking**: Temporary lockout after 5 failed attempts
6. **Input Validation**: Server and client-side validation
7. **CORS Protection**: Configured for production use
8. **Helmet Security**: Security headers and protection

## User Features

### Registration
- Username validation (3-30 characters, alphanumeric + underscore)
- Email validation with proper format checking
- Password strength indicator
- Real-time validation feedback
- Duplicate username/email checking

### Login
- Secure credential verification
- Account lockout protection
- Session persistence
- Remember me functionality
- Failed attempt tracking

### Portfolio Access
- Protected portfolio pages
- User session management
- Automatic token refresh
- Logout functionality
- User profile display

## Technologies Used

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **express-session**: Session management
- **connect-mongo**: MongoDB session store

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties
- **JavaScript ES6+**: Modern JavaScript features
- **Font Awesome**: Icons
- **Google Fonts**: Typography (Orbitron, Rajdhani)

### Security
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **express-rate-limit**: Rate limiting
- **Input validation**: Server and client-side

## Development

### Running in Development
```bash
npm run dev
```

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `SESSION_SECRET`: Secret key for sessions
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### Database Schema

#### User Model
```javascript
{
  username: String (required, unique, 3-30 chars)
  email: String (required, unique, valid email)
  password: String (required, hashed, min 6 chars)
  role: String (user/admin, default: user)
  isVerified: Boolean (default: true)
  lastLogin: Date
  loginAttempts: Number (default: 0)
  lockUntil: Date
  preferences: {
    theme: String (light/dark)
    notifications: Boolean
  }
  timestamps: true
}
```

## Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Use strong secrets for JWT and sessions
3. Configure MongoDB Atlas or production database
4. Set up SSL/HTTPS
5. Configure proper CORS origins
6. Set up process manager (PM2)

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_auth
JWT_SECRET=your_production_jwt_secret_256_bits_long
SESSION_SECRET=your_production_session_secret_256_bits_long
PORT=3000
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact:
- Email: yashagarwala2709@gmail.com
- LinkedIn: [Yash Agarwal](https://www.linkedin.com/in/yash-agarwal-632418259/)

## Changelog

### v1.0.0
- Initial release with authentication system
- JARVIS-themed portfolio interface
- MongoDB integration
- Complete project showcase
- Security features implementation