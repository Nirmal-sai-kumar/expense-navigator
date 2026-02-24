const { MongoClient, ObjectId } = require('mongodb');

// Connection URI from environment
const uri = process.env.MONGODB_URI;
const directUri = process.env.MONGODB_URI_DIRECT;
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

        const isSrvDnsFailure =
            error?.syscall === 'querySrv' ||
            (typeof error?.message === 'string' && error.message.includes('querySrv'));

        if (isSrvDnsFailure) {
            console.error('\n⚠️  Detected SRV DNS lookup failure.');
            console.error('This usually happens when Node.js cannot resolve SRV records (mongodb+srv://) due to DNS/VPN/corporate network settings.');
            console.error('Fix options:');
            console.error('  1) Use a STANDARD connection string (mongodb://...host1,host2,host3/...) from MongoDB Atlas.');
            console.error('  2) Change DNS servers to a public resolver (e.g., 1.1.1.1 or 8.8.8.8) or disable VPN/proxy.');
            console.error('  3) Set MONGODB_URI_DIRECT to the standard mongodb:// connection string as a fallback.');

            if (directUri) {
                console.log('\n🔁 Retrying with MONGODB_URI_DIRECT fallback...');
                try {
                    const client = new MongoClient(directUri, {
                        serverSelectionTimeoutMS: 30000,
                        connectTimeoutMS: 30000,
                        socketTimeoutMS: 45000,
                        maxPoolSize: 10,
                        minPoolSize: 2,
                        retryWrites: true,
                        retryReads: true,
                    });

                    await client.connect();
                    const db = client.db('expense_navigator');
                    await db.admin().ping();

                    cachedClient = client;
                    cachedDb = db;

                    console.log('✅ Connected using MONGODB_URI_DIRECT');
                    return { client, db };
                } catch (fallbackError) {
                    console.error('❌ Fallback connection failed too:', fallbackError?.message || fallbackError);
                }
            }
        }
        
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
