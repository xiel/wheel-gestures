/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // TODO: current use-spring is not compatible with strict mode
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
