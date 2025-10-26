// Database configuration file
require('dotenv').config();

const config = {
    // MongoDB connection URI from environment variable
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_navigator',
    
    // Database name
    dbName: process.env.DB_NAME || 'expense_navigator',
    
    // Connection options for MongoDB
    options: {
        // Use new URL parser
        useNewUrlParser: true,
        
        // Use unified topology
        useUnifiedTopology: true,
        
        // Maximum pool size
        maxPoolSize: 10,
        
        // Server selection timeout (30 seconds)
        serverSelectionTimeoutMS: 30000,
        
        // Socket timeout (45 seconds)
        socketTimeoutMS: 45000
    },
    
    // Collection names
    collections: {
        users: 'users',
        expenses: 'expenses'
    }
};

module.exports = config;
