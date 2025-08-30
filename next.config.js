/** @type {import('next').NextConfig} */

// Safe/optional bundle analyzer wrapper
const withBundleAnalyzer = (() => {
  if (process.env.ANALYZE === 'true') {
    try {
      const bundleAnalyzer = require('@next/bundle-analyzer');
      return bundleAnalyzer({ enabled: true });
    } catch {
      console.warn('[next.config] @next/bundle-analyzer not installed, skipping.');
    }
  }
  return (cfg) => cfg;
})();

const nextConfig = {
  // ...existing config...
  reactStrictMode: true,
  compiler: {
    // Drop console.* in production to reduce client bundle size
    removeConsole: { exclude: ['error', 'warn'] },
  },
  experimental: {
    // Help Next rewrite named imports to per-file imports for better tree-shaking
    optimizePackageImports: [
      'wagmi',
      'viem',
      '@tanstack/react-query',
      '@coinbase/onchainkit',
      '@farcaster/frame-sdk',
    ],
  },
  // Additional safeguard for apps that use named imports
  modularizeImports: {
    viem: { transform: 'viem/{{member}}' },
    wagmi: { transform: 'wagmi/{{member}}' },
    '@tanstack/react-query': { transform: '@tanstack/react-query/{{member}}' },
  },
  webpack: (config, { dev }) => {
    // Increase chunk load timeout (default ~120s). Helpful on slow networks/dev.
    if (config.output) {
      config.output.chunkLoadTimeout = 300000; // 5 minutes
    }
    // Ensure externals to silence known warnings and shrink bundles
    config.externals = config.externals || [];
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // ...existing webpack modifications...
    return config;
  },
  // IMPORTANT: Do NOT set `output: 'export'` because the app uses API routes.
};

module.exports = withBundleAnalyzer(nextConfig);
