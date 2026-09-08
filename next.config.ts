import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* WebP only, and a higher quality than the default 75. These assets are
       illustrations with faces and small baked labels, which is exactly what
       aggressive AVIF quantisation smooths away — at q75 AVIF came out 40%
       smaller than WebP for the services banner, and it showed on the faces.
       Sharpness is worth the bytes on this page. */
    formats: ["image/webp"],
    /* 75 stays the default for everything; the services banner opts into 88. */
    qualities: [75, 88],
  },
};

export default nextConfig;
