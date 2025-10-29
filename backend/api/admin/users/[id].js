// Admin endpoint - Single user operations
const { connectToDatabase } = require('../../_lib/db');
const { requireAuth, requireAdmin } = require('../../_lib/middleware');
const { hashPassword } = require('../../_lib/auth');
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
        
        // Get user ID from query parameter
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required.'
            });
        }
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format.'
            });
        }
        
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        
        // GET - Fetch single user
        if (req.method === 'GET') {
            const user = await usersCollection.findOne(
                { _id: new ObjectId(id) },
                { projection: { password: 0 } } // Exclude password
            );
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'User retrieved successfully.',
                data: user
            });
        }
        
        // PUT - Update user
        if (req.method === 'PUT') {
            const { firstName, lastName, gender, phone, email, username, role } = req.body;
            
            // Validate required fields
            if (!firstName || !lastName || !gender || !phone || !email || !username || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required.'
                });
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format.'
                });
            }
            
            // Validate phone format (10 digits)
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number must be 10 digits.'
                });
            }
            
            // Validate role value
            if (!['user', 'admin'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role. Must be "user" or "admin".'
                });
            }
            
            // Check if user exists
            const existingUser = await usersCollection.findOne({ _id: new ObjectId(id) });
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            }
            
            // Check if email is already taken by another user
            const emailExists = await usersCollection.findOne({
                email: email,
                _id: { $ne: new ObjectId(id) }
            });
            
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use by another user.'
                });
            }
            
            // Build update object
            const updateData = {
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                phone: phone,
                email: email.toLowerCase(),
                username: username,
                role: role,
                updatedAt: new Date()
            };
            
            // Update user
            const result = await usersCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { 
                    returnDocument: 'after',
                    projection: { password: 0 } // Exclude password from response
                }
            );
            
            return res.status(200).json({
                success: true,
                message: 'User updated successfully.',
                data: result.value || result
            });
        }
        
        // DELETE - Delete user
        if (req.method === 'DELETE') {
            // Prevent admin from deleting themselves
            if (id === req.user.userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete your own account.'
                });
            }
            
            const result = await usersCollection.deleteOne({
                _id: new ObjectId(id)
            });
            
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            }
            
            // Also delete all expenses of this user
            const expensesCollection = db.collection('expenses');
            await expensesCollection.deleteMany({ userId: id });
            
            return res.status(200).json({
                success: true,
                message: 'User and associated data deleted successfully.'
            });
        }
        
        // Method not allowed
        return res.status(405).json({
            success: false,
            message: 'Method not allowed. Use GET, PUT, or DELETE.'
        });
        
    } catch (error) {
        console.error('Admin user operation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred.'
        });
    }
};
