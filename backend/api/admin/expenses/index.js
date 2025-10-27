// Admin endpoint - List all expenses from all users
const { connectToDatabase } = require('../../_lib/db');
const { requireAuth, requireAdmin } = require('../../_lib/middleware');
const { ObjectId } = require('mongodb');

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
        const expensesCollection = db.collection('expenses');
        const usersCollection = db.collection('users');
        
        // Fetch all expenses with user information
        const expenses = await expensesCollection
            .find({})
            .sort({ date: -1 })
            .toArray();
        
        // Enrich expenses with username
        const enrichedExpenses = await Promise.all(
            expenses.map(async (expense) => {
                // Convert userId to ObjectId if it's a string
                let userIdToSearch = expense.userId;
                if (typeof expense.userId === 'string') {
                    try {
                        userIdToSearch = new ObjectId(expense.userId);
                    } catch (e) {
                        console.error('Invalid userId format:', expense.userId);
                    }
                }
                
                const user = await usersCollection.findOne(
                    { _id: userIdToSearch },
                    { projection: { username: 1 } }
                );
                
                console.log('Expense userId:', expense.userId, 'Found user:', user?.username); // Debug log
                
                return {
                    _id: expense._id,
                    userId: expense.userId,
                    username: user?.username || 'Unknown',
                    source: expense.source || expense.title || 'N/A',
                    amount: expense.amount,
                    category: expense.category, // Keep for backward compatibility
                    date: expense.date,
                    createdAt: expense.createdAt,
                    updatedAt: expense.updatedAt
                };
            })
        );
        
        return res.status(200).json({
            success: true,
            message: 'All expenses retrieved successfully.',
            data: enrichedExpenses
        });
        
    } catch (error) {
        console.error('Admin expenses fetch error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred while fetching expenses.'
        });
    }
};
