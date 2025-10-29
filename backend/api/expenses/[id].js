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
            
            // Validate inputs
            if (!source || !amount || !date) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required.'
                });
            }
            
            if (isNaN(amount) || parseFloat(amount) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount must be a positive number.'
                });
            }
            
            // Find expense first to check ownership
            const expense = await expensesCollection.findOne({
                _id: new ObjectId(id)
            });
            
            if (!expense) {
                return res.status(404).json({
                    success: false,
                    message: 'Expense not found.'
                });
            }
            
            // Compare userId as strings (handles both ObjectId and string)
            if (expense.userId.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to update this expense.'
                });
            }
            
            // Update expense
            const updateData = {
                source: source,
                amount: parseFloat(amount),
                date: new Date(date),
                updatedAt: new Date()
            };
            
            const result = await expensesCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: 'after' }
            );
            
            // Return SUCCESS response with consistent format
            return res.status(200).json({
                success: true,
                message: 'Expense updated successfully.',
                data: result.value || result
            });
        }
        
        // DELETE - Delete expense
        if (req.method === 'DELETE') {
            // Find expense first to check ownership
            const expense = await expensesCollection.findOne({
                _id: new ObjectId(id)
            });
            
            if (!expense) {
                return res.status(404).json({
                    success: false,
                    message: 'Expense not found.'
                });
            }
            
            // Compare userId as strings (handles both ObjectId and string)
            if (expense.userId.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to delete this expense.'
                });
            }
            
            await expensesCollection.deleteOne({
                _id: new ObjectId(id)
            });
            
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
