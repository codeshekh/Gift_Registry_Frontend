/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:{
  ignoreDuringBuilds:true,
  },
    images: {
      domains: ['rukminim2.flixcart.com', 'm.media-amazon.com','image.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'm.media-amazon.com ',
          port: '',
          pathname: '/images/**',
        },
      ],
    },
  }
  
  export default nextConfig;