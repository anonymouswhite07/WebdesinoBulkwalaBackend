// ===== UNIVERSAL COOKIE HANDLER =====
export const getCookieOptions = (req) => {
  const isProd = process.env.NODE_ENV === "production";
  
  // For development, use Lax sameSite to avoid cross-site cookie issues
  // For production, we need to ensure secure is true when using SameSite=None
  const isHttps = req.headers['x-forwarded-proto'] === 'https' || req.secure || req.connection.encrypted;
  const sameSite = isProd ? "None" : "Lax";
  const secure = isProd ? isHttps : false;
  
  // Additional options for better cross-origin compatibility
  const cookieOptions = {
    httpOnly: true,
    secure: secure, // required for SameSite=None in production and when using HTTPS
    sameSite: sameSite, // Lax for development, None for production
    path: "/", // accessible everywhere
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days (matching refresh token expiry)
  };
  
  // For mobile Safari, we need to adjust settings for better compatibility
  const userAgent = req.headers['user-agent'] || '';
  const isMobileSafari = /iPhone|iPad|iPod.*Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
  
  if (isMobileSafari) {
    // Mobile Safari has issues with SameSite=None, even with secure
    // Use Lax for mobile Safari to be safer
    cookieOptions.sameSite = "Lax";
    // Ensure secure is false for localhost development
    if (!isProd) {
      cookieOptions.secure = false;
    }
    // Add domain attribute for better cross-origin support
    cookieOptions.domain = undefined; // Let browser determine domain
  }
  
  // Additional fix for Safari - ensure partitioned cookies work properly
  // This is important for Safari 16+ which uses Intelligent Tracking Prevention
  if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    // For Safari, we might need to adjust the cookie settings
    cookieOptions.sameSite = "Lax"; // Safer option for Safari
    // Don't set domain explicitly to avoid issues
    delete cookieOptions.domain;
    
    // Additional Safari-specific fixes
    // Remove secure flag for localhost in Safari to avoid issues
    if (!isProd && req.headers.host && req.headers.host.includes('localhost')) {
      cookieOptions.secure = false;
    }
  }
  
  // For all browsers in production, ensure we have the right settings EXCEPT for Safari
  if (isProd && !/Safari/i.test(userAgent)) {
    // In production, we need SameSite=None for cross-domain requests (but not for Safari)
    cookieOptions.sameSite = "None";
    cookieOptions.secure = true;
    // Explicitly set domain for better cross-origin support
    // This helps with cookies being sent properly between frontend and backend on different domains
    cookieOptions.domain = undefined; // Let the browser determine the domain automatically
  }
  
  // Additional fix for Render deployment
  // When deploying on Render, we need to ensure cookies work across origins
  if (isProd && req.headers.host && req.headers.host.includes('onrender.com')) {
    cookieOptions.sameSite = "None";
    cookieOptions.secure = true;
    // Don't set domain explicitly for Render deployments to avoid issues
    cookieOptions.domain = undefined;
  }
  
  return cookieOptions;
};

export const userRoleEnum = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  SELLER: "seller",
};

export const availableUserRoles = Object.values(userRoleEnum);

export const paymentModeEnum = {
  COD: "cod",
  NETBANKING: "netbanking",
  UPI: "upi",
  CARD: "card",
  ONLINE: "online",
  PICKUP: "pickup", // ✅ New mode added
};

export const availablePaymentModes = Object.values(paymentModeEnum);

export const orderStatusEnum = {
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  PROCESSING: "Processing",
  CANCELLED: "Cancelled",
};

export const availableOrderStatus = Object.values(orderStatusEnum);

export const paymentStatusEnum = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const availablePaymentStatus = Object.values(paymentStatusEnum);