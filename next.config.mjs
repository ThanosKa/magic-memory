import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  // Put metadata in the initial <head> for every visitor, not only known bots.
  // vinext otherwise streams generateMetadata output into the body on pages
  // Next would prerender, for browsers and Googlebot alike.
  htmlLimitedBots: /.*/,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.replicate.delivery" },
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "pbxt.replicate.delivery" },
    ],
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/**" },
    ],
  },
  turbopack: {
    root: path.join(__dirname, "."),
  },
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "thread-stream",
    "sonic-boom",
    "replicate",
  ],
  async redirects() {
    return [
      {
        source: "/compare/remini-vs-myheritage",
        destination: "/alternatives",
        permanent: true,
      },
      {
        source: "/compare/remini-vs-vanceai",
        destination: "/alternatives",
        permanent: true,
      },
      {
        source: "/compare/myheritage-vs-vanceai",
        destination: "/alternatives",
        permanent: true,
      },
      {
        source: "/&",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;