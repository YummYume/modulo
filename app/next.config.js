/** @type {import('next').NextConfig} */

const { createSecureHeaders } = require("next-secure-headers");
const withNextBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: "true" === process.env.ANALYZE });

const nextConfig = {
    reactStrictMode: true,
    i18n: {
        locales: ["fr-FR"],
        defaultLocale: "fr-FR"
    },
    async headers() {
        return [{ source: "/(.*)", headers: createSecureHeaders() }];
    },
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300
        };

        return config;
    }
};

module.exports = withNextBundleAnalyzer(nextConfig);
