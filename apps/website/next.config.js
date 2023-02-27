const { withTailprops } = require("tailprops-next");
const addMdx = require("@next/mdx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  experimental: {
    appDir: true,
    mdxRs: true,
  },
};

addMdx(nextConfig);

module.exports = withTailprops(nextConfig);
