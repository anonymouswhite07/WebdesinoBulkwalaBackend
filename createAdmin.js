import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected successfully");

    // Check if admin already exists and delete it
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      await User.deleteOne({ email: "admin@example.com" });
      console.log("Existing admin user deleted");
    }

    // Create admin user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("Admin123!", saltRounds);

    // Bypass the pre-save hook by using insertMany
    const adminUser = await User.insertMany([{
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      phone: "1234567890",
      role: "admin",
      isVerified: true
    }]);

    console.log("✅ Admin user created successfully with password: Admin123!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdminUser();