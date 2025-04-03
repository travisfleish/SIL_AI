/** @type {import('next').NextConfig} */
const nextConfig = { // Change module.exports to const nextConfig
  images: {
    domains: [
      'source.unsplash.com',
      'images.unsplash.com',
      'storage.googleapis.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com'
    ],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  env: {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    SHEET_ID: process.env.SHEET_ID,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

export default nextConfig; // Keep this line as it is