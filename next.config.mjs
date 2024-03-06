/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orhfcobb0lrfqssk.public.blob.vercel-storage.com",
        port: "",
        pathname: "/***",
      },
    ],
  },
};

export default nextConfig;