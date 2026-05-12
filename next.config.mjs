/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdnbbsr.s3waas.gov.in",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
