const withSerwistInit = require('@serwist/next').default;

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // Disabled in dev — no reason to fight a service worker cache while
  // hot-reloading. Serwist itself supports Turbopack natively, unlike
  // the old next-pwa, so this wrapper isn't the source of the conflict.
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack couldn't tell which folder was actually the project root
  // because it found an unrelated lockfile elsewhere in the home
  // directory tree. Pinning it explicitly removes the ambiguity.
  turbopack: {
    root: __dirname,
  },
  // Bundler-agnostic replacement for the old `webpack: (config) => {...}`
  // externals hack — this keeps `canvas` out of the server bundle under
  // both Turbopack (Next 16's default) and webpack, instead of a raw
  // webpack function Turbopack doesn't know how to interpret.
  serverExternalPackages: ['canvas'],
};

module.exports = withSerwist(nextConfig);
