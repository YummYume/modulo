/** @type {import('next').NextConfig} */
/** @type {import('next-sitemap').IConfig} */

const securityHeaders = [
    {
        key: "X-DNS-Prefetch-Control",
        value: "on"
    },
    {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload"
    },
    {
        key: "X-XSS-Protection",
        value: "1; mode=block"
    },
    {
        key: "X-Frame-Options",
        value: "DENY"
    },
    {
        key: "Referrer-Policy",
        value: "origin-when-cross-origin"
    }
];

const nextConfig = {
    reactStrictMode: true,
    siteUrl: process.env.SITE_URL,
    generateRobotsTxt: true,

    i18n: {
        locales: ["fr-FR"],
        defaultLocale: "fr-FR"
    },

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders
            }
        ];
    },

    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300
        };

        return config;
    }
};

module.exports = nextConfig;
