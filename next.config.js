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
      '@farcaster/miniapp-sdk',
      'three',
    ],
  },
  // Additional safeguard for apps that use named imports
  modularizeImports: {
    viem: { transform: 'viem/{{member}}' },
    wagmi: { transform: 'wagmi/{{member}}' },
    '@tanstack/react-query': { transform: '@tanstack/react-query/{{member}}' },
  },
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination:
          'https://api.farcaster.xyz/miniapps/hosted-manifest/0198fdc4-b7d1-e965-44f2-24f9340b227c',
        permanent: false,
        statusCode: 307,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/.well-known/farcaster.json',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'Content-Type', value: 'application/json; charset=utf-8' }
        ]
      }
    ];
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
