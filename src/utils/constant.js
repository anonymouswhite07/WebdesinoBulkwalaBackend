// ===== UNIVERSAL COOKIE HANDLER =====
export const getCookieOptions = (req) => {
  const isProd = process.env.NODE_ENV === "production";
  
  // For development, use Lax sameSite to avoid cross-site cookie issues
  // For production, we need to ensure secure is true when using SameSite=None
  const isHttps = req.headers['x-forwarded-proto'] === 'https' || req.secure || req.connection.encrypted;
  const sameSite = isProd ? "None" : "Lax";
  const secure = isProd ? isHttps : false;
  
  // Additional options for better mobile Safari compatibility
  const cookieOptions = {
    httpOnly: true,
    secure: secure, // required for SameSite=None in production and when using HTTPS
    sameSite: sameSite, // Lax for development, None for production
    path: "/", // accessible everywhere
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days (matching refresh token expiry)
  };
  
  // For mobile Safari, we might need to adjust some settings
  const userAgent = req.headers['user-agent'] || '';
  const isMobileSafari = /iPhone|iPad|iPod.*Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
  
  if (isMobileSafari) {
    // Mobile Safari sometimes has issues with SameSite=None, even with secure
    // Let's use Lax for mobile Safari to be safer
    cookieOptions.sameSite = "Lax";
    // Ensure secure is false for localhost development
    if (!isProd) {
      cookieOptions.secure = false;
    }
  }
  
  return cookieOptions;
};