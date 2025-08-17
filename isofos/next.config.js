const nextConfig = {
  // Enable experimental features
  experimental: {
    optimizeFonts: true,
  },
  // Add timeout configuration for font loading
  images: {
    domains: ['fonts.gstatic.com'],
  },
};

module.exports = nextConfig;