import Razorpay from "razorpay";

// Initialize Razorpay instance only if credentials are provided
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  console.log("✅ Razorpay client initialized");
} else {
  console.log("⚠️ Razorpay client not initialized - missing credentials");
}

export default razorpayInstance;