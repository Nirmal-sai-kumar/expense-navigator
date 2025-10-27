// User registration endpoint
const { connectToDatabase } = require('../_lib/db');
const { hashPassword, generateToken } = require('../_lib/auth');

module.exports = async (req, res) => {
    try {
        // Only allow POST method
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                message: 'Method not allowed. Use POST.'
            });
        }
        
        // Get ALL user data from request body (matching frontend fields)
        const { firstName, lastName, gender, email, phone, username, password, role } = req.body;
        
        // Validate required input
        if (!firstName || !lastName || !email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided.'
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
        
        // Validate phone (if provided)
        if (phone && !/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be 10 digits.'
            });
        }
        
        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.'
            });
        }
        
        // Connect to database
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        
        // Check if username already exists
        const existingUsername = await usersCollection.findOne({ 
            username: username.toLowerCase() 
        });
        
        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists. Please choose another.'
            });
        }
        
        // Check if email already exists
        const existingEmail = await usersCollection.findOne({ 
            email: email.toLowerCase() 
        });
        
        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered. Please login.'
            });
        }
        
        // Hash password before storing
        const hashedPassword = await hashPassword(password);
        
        // Create new user object with ALL fields
        const newUser = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender: gender || '',
            email: email.toLowerCase().trim(),
            phone: phone || '',
            username: username.toLowerCase().trim(),
            password: hashedPassword,
            role: role === 'admin' ? 'admin' : 'user', // Support both user and admin roles
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Insert user into database
        const result = await usersCollection.insertOne(newUser);
        
        // Generate JWT token for auto-login after registration
        const token = generateToken({
            userId: result.insertedId.toString(),
            email: newUser.email,
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role
        });
        
        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax'
        });
        
        // Return success response
        return res.status(201).json({
            success: true,
            message: 'Registration successful!',
            data: {
                userId: result.insertedId.toString(),
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            token: token
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred during registration.'
        });
    }
};
