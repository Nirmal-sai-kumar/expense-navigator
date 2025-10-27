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
    // Return cached connection if available
    if (cachedClient && cachedDb) {
        console.log('♻️  Using cached MongoDB connection');
        return { client: cachedClient, db: cachedDb };
    }

    try {
        console.log('🔄 Creating new MongoDB connection...');
        console.log('📍 Connection URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password
        
        // Node.js 20 compatible settings - simpler is better
        const client = new MongoClient(uri, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
        });

        console.log('� Attempting to connect to MongoDB Atlas...');
        await client.connect();
        console.log('✅ MongoDB Atlas connected successfully!');
        
        // Verify connection with ping
        await client.db('admin').command({ ping: 1 });
        console.log('✅ MongoDB ping successful!');
        
        const db = client.db('expense_navigator');
        console.log('✅ Database selected: expense_navigator');

        // Cache for reuse
        cachedClient = client;
        cachedDb = db;

        return { client, db };
    } catch (error) {
        console.error('❌ MongoDB connection failed!');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        
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
        return null;
    }
}

module.exports = {
    connectToDatabase,
    ObjectId,
    parseId
};
