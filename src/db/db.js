import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Add connection options to improve reliability
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log("✅ Database connected successfully");
    console.log("Database connection state:", mongoose.connection.readyState);
    console.log("Database host:", conn.connection.host);
    
    // Add connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
  } catch (error) {
    console.log("⚠️ Database connection failed:", error.message);
    console.log("💡 Make sure MongoDB is running on your system");
    console.log("💡 The server will continue running without database connectivity");
  }
};

export default connectDB;