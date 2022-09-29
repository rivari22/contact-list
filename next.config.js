/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    URL_GRAPHQL: process.env.URL_GRAPHQL,
  },
  images: {
    domains: ["bit.ly"],
  },
};

module.exports = nextConfig;
