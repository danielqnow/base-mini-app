/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing config...
  webpack: (config, { dev }) => {
    // Increase chunk load timeout (default ~120s). Helpful on slow networks/dev.
    if (config.output) {
      config.output.chunkLoadTimeout = 300000; // 5 minutes
    }
    // ...existing webpack modifications...
    return config;
  },
};

module.exports = nextConfig;
