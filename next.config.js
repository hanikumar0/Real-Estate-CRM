/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin-portal',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
