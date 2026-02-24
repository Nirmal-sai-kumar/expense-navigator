// Setup database collections and indexes
const { connectToDatabase } = require('./_lib/db');
const { hashPassword } = require('./_lib/auth');
const crypto = require('crypto');

function generateRandomPassword() {
    // URL-safe; good enough for a bootstrap password.
    return crypto.randomBytes(14).toString('base64url');
}

module.exports = async (req, res) => {
    try {
        // Only allow POST method
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                message: 'Method not allowed. Use POST.'
            });
        }

        const isProduction = process.env.NODE_ENV === 'production';

        // In production, protect this endpoint so random visitors cannot create/modify admin accounts.
        if (isProduction) {
            const setupToken = process.env.SETUP_TOKEN;
            if (!setupToken) {
                return res.status(403).json({
                    success: false,
                    message: 'Setup is disabled in production (SETUP_TOKEN is not configured).'
                });
            }

            const providedToken =
                req.headers['x-setup-token'] ||
                req.query?.setupToken ||
                req.body?.setupToken;

            if (providedToken !== setupToken) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Invalid setup token.'
                });
            }
        }
        
        const { db } = await connectToDatabase();
        
        // Create indexes for better performance
        
        // Users collection indexes
        const usersCollection = db.collection('users');
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        await usersCollection.createIndex({ createdAt: -1 });
        
        // Expenses collection indexes
        const expensesCollection = db.collection('expenses');
        await expensesCollection.createIndex({ userId: 1 });
        await expensesCollection.createIndex({ date: -1 });
        await expensesCollection.createIndex({ category: 1 });
        
        // Check if admin user already exists
        const adminExists = await usersCollection.findOne({ role: 'admin' });
        
        let adminCreated = false;
        let adminPasswordForDisplay;
        if (!adminExists) {
            const adminUsername = (process.env.DEFAULT_ADMIN_USERNAME || 'admin').toLowerCase();
            const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@expensenavigator.com').toLowerCase();

            // Prefer explicit password via env; otherwise generate one for development.
            let adminPlainPassword = process.env.DEFAULT_ADMIN_PASSWORD;
            if (!adminPlainPassword) {
                if (isProduction) {
                    return res.status(500).json({
                        success: false,
                        message: 'DEFAULT_ADMIN_PASSWORD must be set in production before running setup.'
                    });
                }
                adminPlainPassword = generateRandomPassword();
                adminPasswordForDisplay = adminPlainPassword;
            }

            const hashedPassword = await hashPassword(adminPlainPassword);
            
            await usersCollection.insertOne({
                firstName: 'Admin',
                lastName: 'User',
                gender: 'Other',
                email: adminEmail,
                phone: '0000000000',
                username: adminUsername,
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            adminCreated = true;
        }
        
        return res.status(200).json({
            success: true,
            message: 'Database setup completed successfully.',
            data: {
                collections: ['users', 'expenses'],
                indexes: 'Created successfully',
                adminUser: adminCreated ? {
                    created: true,
                    username: (process.env.DEFAULT_ADMIN_USERNAME || 'admin').toLowerCase(),
                    email: (process.env.DEFAULT_ADMIN_EMAIL || 'admin@expensenavigator.com').toLowerCase(),
                    // In development we may generate a bootstrap password; in production never return passwords.
                    ...(adminPasswordForDisplay ? { password: adminPasswordForDisplay } : {}),
                    note: adminPasswordForDisplay
                        ? 'This password is shown once. Please change it after first login.'
                        : 'Password is set via DEFAULT_ADMIN_PASSWORD (not returned by API).'
                } : {
                    created: false,
                    note: 'Admin user already exists'
                }
            }
        });
        
    } catch (error) {
        console.error('Database setup error:', error);
        return res.status(500).json({
            success: false,
            message: 'Database setup failed.',
            error: error.message
        });
    }
};
