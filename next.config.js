/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'randomuser.me',
      'jbagy.me',
      'picsum.photos',
      'example.com',
      'cdn-icons-png.flaticon.com',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5194/api/:path*', // Chuyển tiếp request đến backend
      },
    ];
  },
}

module.exports = nextConfig
