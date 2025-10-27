// Single expense operations (get, update, delete)
const { connectToDatabase } = require('../_lib/db');
const { requireAuth } = require('../_lib/middleware');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
    try {
        // Check authentication first
        await new Promise((resolve, reject) => {
            requireAuth(req, res, (error) => {
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
        const userId = req.user.userId;
        
        // GET - Fetch single expense
        if (req.method === 'GET') {
            const expense = await expensesCollection.findOne({
                _id: new ObjectId(id),
                userId: userId // Ensure user can only access their own expenses
            });
            
            if (!expense) {
                return res.status(404).json({
                    success: false,
                    message: 'Expense not found.'
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Expense retrieved successfully.',
                data: expense
            });
        }
        
        // PUT - Update expense
        if (req.method === 'PUT') {
            const { source, amount, date } = req.body;
            
            // Build update object with only provided fields
            const updateData = {
                updatedAt: new Date()
            };
            
            if (source) updateData.source = source;
            if (amount) {
                if (isNaN(amount) || parseFloat(amount) <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Amount must be a positive number.'
                    });
                }
                updateData.amount = parseFloat(amount);
            }
            if (date) updateData.date = new Date(date);
            
            // Update expense
            const result = await expensesCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(id),
                    userId: userId // Ensure user can only update their own expenses
                },
                { $set: updateData },
                { returnDocument: 'after' }
            );
            
            if (!result.value) {
                return res.status(404).json({
                    success: false,
                    message: 'Expense not found or unauthorized.'
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Expense updated successfully.',
                data: result.value
            });
        }
        
        // DELETE - Delete expense
        if (req.method === 'DELETE') {
            const result = await expensesCollection.deleteOne({
                _id: new ObjectId(id),
                userId: userId // Ensure user can only delete their own expenses
            });
            
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Expense not found or unauthorized.'
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
        console.error('Expense operation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred.'
        });
    }
};
