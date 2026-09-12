const withSerwistInit = require('@serwist/next').default;

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // Disabled in dev — same reasoning as before: no reason to fight a
  // service worker cache while hot-reloading.
  disable: process.env.NODE_ENV === 'development',
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

module.exports = withSerwist(nextConfig);
