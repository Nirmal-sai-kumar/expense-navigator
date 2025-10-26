// User logout endpoint
module.exports = async (req, res) => {
    try {
        // Only allow POST method
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                message: 'Method not allowed. Use POST.'
            });
        }
        
        // Clear the authentication cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        
        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Logout successful.'
        });
        
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred during logout.'
        });
    }
};
