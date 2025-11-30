import { Resend } from "resend";

// Initialize Resend client only if API key is provided
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("✅ Resend client initialized");
} else {
  console.log("⚠️ Resend client not initialized - missing API key");
}

export async function sendVerificationEmail(toEmail, verificationToken) {
  // Return early if Resend is not configured
  if (!resend) {
    console.log("⚠️ Resend not configured - skipping email send");
    console.log(`📧 Verification token for ${toEmail}: ${verificationToken}`);
    return true; // Simulate successful send
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: "no-reply@bulkwala.com",
      to: [toEmail],
      subject: "Verify Your Account",
      html: `
        <p>Hello,</p>
        <p>Thank you for registering. Please use the following code to verify your account:</p>
        <h3>${verificationToken}</h3>
        <p>This code will expire in some time.</p>
      `,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      return false;
    }

    console.log("Verification email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("An unexpected error occurred while sending email:", error);
    return false;
  }
}

// New function for sending reset password link
export async function sendResetPasswordEmail(toEmail, userId, resetToken) {
  // Return early if Resend is not configured
  if (!resend) {
    console.log("⚠️ Resend not configured - skipping password reset email");
    console.log(`📧 Password reset token for ${toEmail}: ${resetToken}`);
    return true; // Simulate successful send
  }
  
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${userId}/${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: "no-reply@bulkwala.com",
      to: [toEmail],
      subject: "Password Reset Request",
      html: `
        <p>Hello,</p>
        <p>You have requested a password reset. Please click on the following link to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
      `,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return false;
    }

    console.log("Password reset email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("An unexpected error occurred while sending email:", error);
    return false;
  }
}