import { fileURLToPath } from 'node:url'

const wheelGesturesSource = fileURLToPath(new URL('../src/index.ts', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Bundle the plugin on the server too, so its imports use the same local alias.
  transpilePackages: ['wheel-gestures', 'embla-carousel-wheel-gestures'],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'wheel-gestures$': wheelGesturesSource,
    }
    return config
  },
}

export default nextConfig
