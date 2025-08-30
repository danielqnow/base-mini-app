import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
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
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Generate a static site to ./out during `next build`
  output: 'export',
};

export default withBundleAnalyzer(nextConfig);
