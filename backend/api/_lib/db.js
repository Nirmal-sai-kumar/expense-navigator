const { MongoClient, ObjectId } = require('mongodb');

// Connection URI from environment
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}

// Cache connection for serverless functions
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    // Return cached connection if available and verify it's still alive
    if (cachedClient && cachedDb) {
        console.log('♻️  Using cached MongoDB connection');
        try {
            // Verify connection is still alive
            await cachedClient.db().admin().ping();
            return { client: cachedClient, db: cachedDb };
        } catch (err) {
            console.log('⚠️  Cached connection lost, reconnecting...');
            cachedClient = null;
            cachedDb = null;
        }
    }

    try {
        console.log('🔄 Creating new MongoDB connection...');
        console.log('📍 Connection URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password
        
        // Universal MongoDB connection settings
        // Works with Node.js 18.x, 20.x, and 22.x
        // MongoDB driver handles TLS/SSL automatically
        const client = new MongoClient(uri, {
            // Timeout settings
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            
            // Connection pool settings
            maxPoolSize: 10,
            minPoolSize: 2,
            
            // Retry settings
            retryWrites: true,
            retryReads: true,
        });

        console.log('🔗 Attempting to connect to MongoDB Atlas...');
        await client.connect();
        console.log('✅ MongoDB Atlas connected successfully!');
        
        // Verify connection with ping
        const db = client.db('expense_navigator');
        await db.admin().ping();
        console.log('✅ MongoDB ping successful!');
        console.log('✅ Database selected: expense_navigator');

        // Cache for reuse in serverless functions
        cachedClient = client;
        cachedDb = db;

        return { client, db };
    } catch (error) {
        console.error('❌ MongoDB connection failed!');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        
        // Clear cache on error
        cachedClient = null;
        cachedDb = null;
        
        throw error;
    }
}

// Helper to parse MongoDB ObjectId safely
function parseId(id) {
    try {
        return new ObjectId(id);
    } catch (error) {
        throw new Error(`Invalid ID format: ${id}`);
    }
}

module.exports = {
    connectToDatabase,
    ObjectId,
    parseId
};
