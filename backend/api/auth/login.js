// User login endpoint
const { connectToDatabase } = require('../_lib/db');
const { comparePassword, generateToken } = require('../_lib/auth');

module.exports = async (req, res) => {
    console.log('\n=== LOGIN REQUEST ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('Body:', { ...req.body, password: '[REDACTED]' });
    
    try {
        // Only allow POST method
        if (req.method !== 'POST') {
            console.log('❌ Invalid method:', req.method);
            return res.status(405).json({
                success: false,
                message: 'Method not allowed. Use POST.'
            });
        }
        
        // Get username, password, and role from request body
        const { username, password, role } = req.body;
        
        console.log('📝 Input validation:');
        console.log('  - Username:', username ? '✅' : '❌');
        console.log('  - Password:', password ? '✅' : '❌');
        console.log('  - Role:', role);
        
        // Validate input
        if (!username || !password) {
            console.log('❌ Missing credentials');
            return res.status(400).json({
                success: false,
                message: 'Username and password are required.'
            });
        }
        
        // Validate role selection
        if (!role || (role !== 'user' && role !== 'admin')) {
            console.log('❌ Invalid role:', role);
            return res.status(400).json({
                success: false,
                message: 'Please select a valid role (User or Admin).'
            });
        }
        
        console.log('🔌 Connecting to database...');
        
        // Connect to database
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        
        console.log('✅ Database connected');
        console.log('🔍 Looking for user:', username.toLowerCase());
        
        // Find user by username (case-insensitive)
        const user = await usersCollection.findOne({ username: username.toLowerCase() });
        
        if (!user) {
            console.log('❌ User not found:', username);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password.'
            });
        }
        
        console.log('✅ User found:', user.username);
        console.log('👤 User details:');
        console.log('  - ID:', user._id);
        console.log('  - Email:', user.email);
        console.log('  - Role:', user.role);
        console.log('  - Has password:', !!user.password);
        
        console.log('🔐 Verifying password...');
        
        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            console.log('❌ Invalid password');
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password.'
            });
        }
        
        console.log('✅ Password valid');
        console.log('🔍 Checking role match...');
        
        // Verify role matches user's actual role in database
        const userRole = user.role || 'user';
        if (role !== userRole) {
            console.log(`❌ Role mismatch - Expected: ${userRole}, Got: ${role}`);
            return res.status(403).json({
                success: false,
                message: `Access denied. This account is registered as ${userRole.toUpperCase()}. Please select the correct role.`
            });
        }
        
        console.log('✅ Role matches:', userRole);
        console.log('🔑 Generating token...');
        
        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role || 'user'
        });
        
        console.log('✅ Token generated');
        
        // Set token in HTTP-only cookie (secure in production)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax'
        });
        
        console.log('✅ Cookie set');
        
        const responseData = {
            success: true,
            message: 'Login successful.',
            data: {
                userId: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role || 'user'
            },
            token: token
        };
        
        console.log('✅ LOGIN SUCCESSFUL for user:', username);
        console.log('=== END LOGIN REQUEST ===\n');
        
        // Return success response with user data (without password)
        return res.status(200).json(responseData);
        
    } catch (error) {
        console.error('\n❌ LOGIN ERROR ===');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('Stack trace:', error.stack);
        console.error('=== END ERROR ===\n');
        
        return res.status(500).json({
            success: false,
            message: 'Server error occurred during login.'
        });
    }
};
