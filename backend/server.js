// Express server - Works both locally, on Vercel, and on Render
require('dotenv').config();

// Compatible with Node.js 18.x, 20.x, and higher
// Local: Node.js 18.x LTS
// Vercel: Node.js 20.x (configured in Vercel dashboard)
// Render: Node.js 20.x (configured in render.yaml)

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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'ExpenseNavigator API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

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

// Start server - Works for both local development and Render
// On Render, this will run automatically when the service starts
// On Vercel, this is bypassed (serverless mode)
if (require.main === module || process.env.NODE_ENV === 'production') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n✅ Server is running!`);
        console.log(`📍 Port: ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🗄️  Database: MongoDB Atlas`);
        
        // Show clickable links only in local development
        if (process.env.NODE_ENV !== 'production') {
            const baseUrl = `http://localhost:${PORT}`;
            console.log(`\n🌐 Pages:`);
            console.log(`   🏠 Home:       ${baseUrl}/`);
            console.log(`   🔐 Login:      ${baseUrl}/login`);
            console.log(`   � Register:   ${baseUrl}/register`);
            console.log(`   � Dashboard:  ${baseUrl}/dashboard`);
        }
        
        console.log(`\n✨ Ready to accept requests!\n`);
    });
}

// Export for Vercel serverless deployment
module.exports = app;
