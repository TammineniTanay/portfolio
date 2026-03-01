import nextMDX from "@next/mdx";

const withMDX = nextMDX({
  extension: /\.(md|mdx)$/,
});

const nextConfig = {
  // This allows Next.js to "see" your .mdx files as pages
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);