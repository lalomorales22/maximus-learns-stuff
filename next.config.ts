import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // picsum.photos is no longer needed if all images are local
      // {
      //   protocol: 'https',
      //   hostname: 'picsum.photos',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
