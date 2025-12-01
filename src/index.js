import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/db.js";

// Connect to database (non-blocking)
connectDB();

// Start server regardless of database connection status
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
  console.log(`📡 API available at http://localhost:${process.env.PORT}/api`);
  console.log(`📡 API also available at https://bulkwala-backend-1wfm.onrender.com/api`);
});