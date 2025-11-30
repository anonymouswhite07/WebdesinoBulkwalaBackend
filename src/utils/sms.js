import Twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

// Initialize Twilio client only if valid credentials are provided
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && 
    process.env.TWILIO_AUTH_TOKEN) {
  client = Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log("✅ Twilio client initialized");
} else {
  console.log("⚠️ Twilio client not initialized - invalid or missing credentials");
}

export const sendOtpSms = async (phone) => {
  // Return early if Twilio is not configured
  if (!client) {
    console.log("⚠️ Twilio not configured - skipping SMS send");
    return "pending"; // Simulate pending status
  }
  
  try {
    const result = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: `+91${phone}`,
        channel: "sms",
      });

    console.log("✅ OTP sent via Twilio:", result.status);
    return result.status;
  } catch (error) {
    console.error("❌ Twilio Verify Send Error:", error);
    throw new Error("Failed to send OTP via Twilio Verify");
  }
};

export const verifyOtpSms = async (phone, otp) => {
  // Return early if Twilio is not configured
  if (!client) {
    console.log("⚠️ Twilio not configured - simulating OTP verification");
    // In development, accept any non-empty OTP
    return otp && otp.length > 0;
  }
  
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      });

    console.log("✅ Verification Check:", verificationCheck.status);
    return verificationCheck.status === "approved";
  } catch (error) {
    console.error("❌ Twilio Verify Check Error:", error);
    throw new Error("Failed to verify OTP via Twilio Verify");
  }
};