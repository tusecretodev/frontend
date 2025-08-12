/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: 'https://api.tusecreto.net',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.tusecreto.net/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;