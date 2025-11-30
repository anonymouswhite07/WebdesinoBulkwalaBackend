import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const testPassword = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected successfully");

    // Find the admin user
    const user = await User.findOne({ email: "admin@example.com" });
    if (!user) {
      console.log("❌ Admin user not found");
      process.exit(1);
    }

    console.log("User found:", user.email);
    console.log("User role:", user.role);
    console.log("User verified:", user.isVerified);
    
    // Test password
    const isPasswordCorrect = await user.isPasswordCorrect("Admin123!");
    console.log("Password correct:", isPasswordCorrect);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error testing password:", error.message);
    process.exit(1);
  }
};

testPassword();