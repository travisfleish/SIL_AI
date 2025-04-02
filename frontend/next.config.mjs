/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'source.unsplash.com',
      'images.unsplash.com',
      'storage.googleapis.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com'
    ],
    unoptimized: process.env.NODE_ENV !== 'production', // Helpful for development
  },
  // This ensures that Next.js is aware of and can properly handle your .env.local file
  env: {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    SHEET_ID: process.env.SHEET_ID,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

export default nextConfig;