/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['randomuser.me', 'jbagy.me'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:7266/api/:path*', // Chuyển tiếp request đến backend
      },
    ];
  },
}

module.exports = nextConfig
