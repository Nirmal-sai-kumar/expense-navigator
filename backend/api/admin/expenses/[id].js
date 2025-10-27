// Admin endpoint - Single expense operations (get, update, delete)
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
        
        // Get expense ID from query parameter
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Expense ID is required.'
            });
        }
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid expense ID format.'
            });
        }
        
        const { db } = await connectToDatabase();
        const expensesCollection = db.collection('expenses');
        
        // GET - Fetch single expense
        if (req.method === 'GET') {
            const expense = await expensesCollection.findOne({
                _id: new ObjectId(id)
            });
            
            if (!expense) {
                return res.status(404).json({
                    success: false,
                    message: 'Expense not found.'
                });
            }
            
            // Get username for this expense
            const usersCollection = db.collection('users');
            let userIdToSearch = expense.userId;
            
            // Convert userId to ObjectId if it's a string
            if (typeof expense.userId === 'string') {
                userIdToSearch = new ObjectId(expense.userId);
            }
            
            const user = await usersCollection.findOne(
                { _id: userIdToSearch },
                { projection: { username: 1 } }
            );
            
            console.log('Admin GET expense - userId:', expense.userId, 'Found user:', user?.username);
            
            return res.status(200).json({
                success: true,
                message: 'Expense retrieved successfully.',
                data: {
                    _id: expense._id,
                    userId: expense.userId,
                    username: user?.username || 'Unknown',
                    source: expense.source || expense.title || 'N/A',
                    amount: expense.amount,
                    date: expense.date,
                    description: expense.description || '',
                    createdAt: expense.createdAt,
                    updatedAt: expense.updatedAt
                }
            });
        }
        
        // PUT - Update expense (admin can update any expense)
        if (req.method === 'PUT') {
            const { source, amount, date, description } = req.body;
            
            // Validate required fields
            if (!source || !amount || !date) {
                return res.status(400).json({
                    success: false,
                    message: 'Source, amount, and date are required.'
                });
            }
            
            // Validate amount
            if (isNaN(amount) || parseFloat(amount) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount must be a positive number.'
                });
            }
            
            const updateData = {
                source: source.trim(),
                amount: parseFloat(amount),
                date: new Date(date),
                description: description ? description.trim() : '',
                updatedAt: new Date()
            };
            
            console.log('Admin updating expense:', id, 'with data:', updateData);
            
            const result = await expensesCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );
            
            if (result.matchedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Expense not found.'
                });
            }
            
            console.log('✅ Admin expense updated successfully:', id);
            
            return res.status(200).json({
                success: true,
                message: 'Expense updated successfully.',
                data: { _id: id, ...updateData }
            });
        }
        
        // DELETE - Delete expense (admin can delete any expense)
        if (req.method === 'DELETE') {
            const result = await expensesCollection.deleteOne({
                _id: new ObjectId(id)
            });
            
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Expense not found.'
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Expense deleted successfully.'
            });
        }
        
        // Method not allowed
        return res.status(405).json({
            success: false,
            message: 'Method not allowed. Use GET, PUT, or DELETE.'
        });
        
    } catch (error) {
        console.error('Admin expense operation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred.'
        });
    }
};
