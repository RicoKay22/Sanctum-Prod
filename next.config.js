const withPWA = require('next-pwa')({
  dest: 'public',
  // Disabled in dev so hot-reload isn't fighting a service worker cache.
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep large client-side libs (pdf.js, tesseract.js, pptxgenjs) out of
  // the server bundle — they only ever run in the browser.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas'];
    }
    return config;
  },
};

module.exports = withPWA(nextConfig);
