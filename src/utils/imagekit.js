import ImageKit from "imagekit";

// Initialize ImageKit instance only if credentials are provided
let imagekit = null;
if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
  console.log("✅ ImageKit client initialized");
} else {
  console.log("⚠️ ImageKit client not initialized - missing credentials");
}

export default imagekit;