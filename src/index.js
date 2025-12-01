import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/db.js";

// Connect to database (non-blocking)
connectDB();

// Start server regardless of database connection status
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`📡 In production, API should be accessible at your Render URL`);
  } else {
    console.log(`📡 API also available at https://bulkwala-backend-1wfm.onrender.com/api`);
  }
});