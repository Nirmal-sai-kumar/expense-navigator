// Express server - Works both locally and on Vercel
require('dotenv').config();

// Fix for Node.js 22 and MongoDB Atlas SSL issue
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// CORS headers for cross-origin requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// Serve static files from frontend/public folder
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// API Routes

// Test database connection
app.all('/api/test-db', require('./api/test-db'));

// Setup database
app.all('/api/setup-db', require('./api/setup-db'));

// Authentication routes
app.all('/api/auth/register', require('./api/auth/register'));
app.all('/api/auth/login', require('./api/auth/login'));
app.all('/api/auth/logout', require('./api/auth/logout'));

// Expenses routes
app.all('/api/expenses', require('./api/expenses/index'));
app.all('/api/expenses/:id', (req, res) => {
    req.query.id = req.params.id;
    require('./api/expenses/[id]')(req, res);
});

// Admin routes
app.all('/api/admin/users', require('./api/admin/users/index'));
app.all('/api/admin/users/:id', (req, res) => {
    req.query.id = req.params.id;
    require('./api/admin/users/[id]')(req, res);
});

// Admin - Expenses endpoints
app.all('/api/admin/expenses', (req, res) => {
    require('./api/admin/expenses/index')(req, res);
});

app.all('/api/admin/expenses/:id', (req, res) => {
    req.query.id = req.params.id;
    require('./api/admin/expenses/[id]')(req, res);
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/dashboard.html'));
});

app.get('/setup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/setup.html'));
});

// Admin pages
app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/admin/dashboard.html'));
});

app.get('/admin/edit-user', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/admin/edit-user.html'));
});

app.get('/admin/edit-expense', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/admin/edit-expense.html'));
});

// User edit expense page
app.get('/edit-expense', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/edit-expense.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server (only when not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n✅ Server is running!`);
        console.log(`📍 Local: http://localhost:${PORT}`);
        console.log(`🗄️  Database: MongoDB Atlas`);
        console.log(`\n📚 API Endpoints:`);
        console.log(`   GET  /api/test-db - Test database connection`);
        console.log(`   POST /api/setup-db - Setup database`);
        console.log(`   POST /api/auth/register - Register new user`);
        console.log(`   POST /api/auth/login - User login`);
        console.log(`   POST /api/auth/logout - User logout`);
        console.log(`   GET  /api/expenses - Get all expenses`);
        console.log(`   POST /api/expenses - Create new expense`);
        console.log(`   GET  /api/expenses/:id - Get expense by ID`);
        console.log(`   PUT  /api/expenses/:id - Update expense`);
        console.log(`   DELETE /api/expenses/:id - Delete expense`);
        console.log(`   GET  /api/admin/users - Get all users (admin only)`);
        console.log(`   GET  /api/admin/users/:id - Get user by ID (admin only)`);
        console.log(`   PUT  /api/admin/users/:id - Update user (admin only)`);
        console.log(`   DELETE /api/admin/users/:id - Delete user (admin only)`);
        console.log(`\n🌐 Pages:`);
        console.log(`   http://localhost:${PORT}/ - Home`);
        console.log(`   http://localhost:${PORT}/login - Login`);
        console.log(`   http://localhost:${PORT}/register - Register`);
        console.log(`   http://localhost:${PORT}/dashboard - Dashboard`);
        console.log(`\n✨ Ready to accept requests!\n`);
    });
}

// Export for Vercel serverless deployment
module.exports = app;
