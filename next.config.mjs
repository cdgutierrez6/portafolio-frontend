/** @type {import('next').NextConfig} */

// En dev, Next.js Fast Refresh (react-refresh) evalúa strings como JS → requiere 'unsafe-eval'.
// Sin él, el CSP rompe la hidratación en dev (Skip/intro/animaciones no responden). Prod queda estricto.
const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  { key: "X-Frame-Options",           value: "DENY" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  // HSTS — force HTTPS for 1 year, include subdomains
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // CSP — restrict sources to self + necessary CDNs
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`, // unsafe-inline: hidratación Next; unsafe-eval: solo dev (Fast Refresh)
      "style-src 'self' 'unsafe-inline'",    // unsafe-inline needed for inline Tailwind styles
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http",  hostname: "localhost" },
      // Restrict to known image CDN hostnames instead of wildcard
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
