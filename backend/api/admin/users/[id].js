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
            const { name, email, role, password } = req.body;
            
            // Build update object
            const updateData = {
                updatedAt: new Date()
            };
            
            if (name) updateData.name = name;
            if (email) {
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid email format.'
                    });
                }
                updateData.email = email.toLowerCase();
            }
            if (role) {
                // Validate role value
                if (!['user', 'admin'].includes(role)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid role. Must be "user" or "admin".'
                    });
                }
                updateData.role = role;
            }
            if (password) {
                // Hash new password
                if (password.length < 6) {
                    return res.status(400).json({
                        success: false,
                        message: 'Password must be at least 6 characters long.'
                    });
                }
                updateData.password = await hashPassword(password);
            }
            
            // Update user
            const result = await usersCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { 
                    returnDocument: 'after',
                    projection: { password: 0 } // Exclude password from response
                }
            );
            
            if (!result.value) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'User updated successfully.',
                data: result.value
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
