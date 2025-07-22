// Simple test to check if MongoDB connection works
const mongoose = require("mongoose");

// Test with local MongoDB
const LOCAL_MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

console.log("Testing MongoDB connection...");

async function testConnection() {
    try {
        await mongoose.connect(LOCAL_MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ SUCCESS: Connected to local MongoDB!");
        
        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("📁 Collections found:", collections.map(c => c.name));
        
    } catch (error) {
        console.log(" FAILED: Could not connect to local MongoDB");
        console.log("Error:", error.message);
        console.log("\n💡 SOLUTION: Use MongoDB Atlas instead");
        console.log("Follow the instructions in QUICK-FIX.md");
    } finally {
        await mongoose.disconnect();
        console.log("Connection closed.");
    }
}

testConnection(); 