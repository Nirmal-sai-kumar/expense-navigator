// Setup database collections and indexes
const { connectToDatabase } = require('./_lib/db');
const { hashPassword } = require('./_lib/auth');

module.exports = async (req, res) => {
    try {
        // Only allow POST method
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                message: 'Method not allowed. Use POST.'
            });
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
        if (!adminExists) {
            // Create default admin user with ALL fields
            const hashedPassword = await hashPassword('admin123');
            
            await usersCollection.insertOne({
                firstName: 'Admin',
                lastName: 'User',
                gender: 'Other',
                email: 'admin@expensenavigator.com',
                phone: '0000000000',
                username: 'admin',
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
                    username: 'admin',
                    email: 'admin@expensenavigator.com',
                    password: 'admin123',
                    note: 'Please change the admin password after first login!'
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
