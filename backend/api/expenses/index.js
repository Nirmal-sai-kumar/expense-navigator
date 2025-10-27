// Expenses list and create endpoint
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
        
        const { db } = await connectToDatabase();
        const expensesCollection = db.collection('expenses');
        
        // GET - Fetch all expenses for logged-in user
        if (req.method === 'GET') {
            // Get user ID from authenticated request
            const userId = req.user.userId;
            
            // Fetch expenses for this user only
            const expenses = await expensesCollection
                .find({ userId: userId })
                .sort({ date: -1 }) // Sort by date, newest first
                .toArray();
            
            return res.status(200).json({
                success: true,
                message: 'Expenses retrieved successfully.',
                data: expenses
            });
        }
        
        // POST - Create new expense
        if (req.method === 'POST') {
            const { source, amount, date } = req.body;
            
            // Validate required fields
            if (!source || !amount || !date) {
                return res.status(400).json({
                    success: false,
                    message: 'Source, amount, and date are required.'
                });
            }
            
            // Validate amount is a positive number
            if (isNaN(amount) || parseFloat(amount) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount must be a positive number.'
                });
            }
            
            // Create new expense object
            const newExpense = {
                userId: req.user.userId,
                source: source,
                amount: parseFloat(amount),
                date: new Date(date),
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Insert expense into database
            const result = await expensesCollection.insertOne(newExpense);
            
            return res.status(201).json({
                success: true,
                message: 'Expense created successfully.',
                data: {
                    _id: result.insertedId,
                    ...newExpense
                }
            });
        }
        
        // Method not allowed
        return res.status(405).json({
            success: false,
            message: 'Method not allowed. Use GET or POST.'
        });
        
    } catch (error) {
        console.error('Expenses endpoint error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred.'
        });
    }
};
