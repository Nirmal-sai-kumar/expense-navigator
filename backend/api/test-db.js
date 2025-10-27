// Test database connection endpoint
const { connectToDatabase } = require('./_lib/db');

module.exports = async (req, res) => {
    try {
        // Only allow GET method
        if (req.method !== 'GET') {
            return res.status(405).json({
                success: false,
                message: 'Method not allowed. Use GET.'
            });
        }
        
        // Try to connect to database
        const { client, db } = await connectToDatabase();
        
        // Try to ping the database
        const result = await client.db('admin').command({ ping: 1 });
        
        // Count collections to verify access
        const collections = await db.listCollections().toArray();
        
        return res.status(200).json({
            success: true,
            message: 'Database connection successful!',
            data: {
                status: 'Connected',
                ping: result,
                collections: collections.map(c => c.name),
                timestamp: new Date()
            }
        });
        
    } catch (error) {
        console.error('Database test error:', error);
        return res.status(500).json({
            success: false,
            message: 'Database connection failed.',
            error: error.message
        });
    }
};
