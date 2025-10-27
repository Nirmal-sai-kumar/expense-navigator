// Admin endpoint - List all users
const { connectToDatabase } = require('../../_lib/db');
const { requireAuth, requireAdmin } = require('../../_lib/middleware');

module.exports = async (req, res) => {
    try {
        // Check authentication and admin authorization
        await new Promise((resolve, reject) => {
            requireAuth(req, res, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
        
        await new Promise((resolve, reject) => {
            requireAdmin(req, res, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
        
        // Only allow GET method
        if (req.method !== 'GET') {
            return res.status(405).json({
                success: false,
                message: 'Method not allowed. Use GET.'
            });
        }
        
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        
        // Fetch all users (excluding passwords)
        const users = await usersCollection
            .find({}, {
                projection: {
                    password: 0 // Exclude password field
                }
            })
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .toArray();
        
        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully.',
            data: users,
            count: users.length
        });
        
    } catch (error) {
        console.error('Admin users list error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred.'
        });
    }
};
