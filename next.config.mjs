/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              connect-src 'self' https://clerk-telemetry.com https://scdn.clerk.com https://api.stripe.com https://*.js.stripe.com;
              script-src 'self' 'unsafe-inline' https://*.js.stripe.com;
              frame-src https://js.stripe.com;
            `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
