/** @type {import('next').NextConfig} */

const { createSecureHeaders } = require("next-secure-headers");
const withNextBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: "true" === process.env.ANALYZE });
const path = require("path");

const srcSubDomain = `*.${process.env.NEXT_PUBLIC_HOST_DOMAIN}`;
const imageSubDomains = process.env.NEXT_PUBLIC_API_HOSTNAME;
const scriptSrcs = "development" === process.env.NODE_ENV ? ["'self'", "'unsafe-eval'"] : ["'self'"];

const nextConfig = {
    reactStrictMode: true,
    i18n: {
        locales: ["fr-FR"],
        defaultLocale: "fr-FR"
    },
    images: {
        domains: [imageSubDomains]
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: createSecureHeaders({
                    forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
                    referrerPolicy: "same-origin",
                    frameGuard: "deny",
                    noopen: "noopen",
                    nosniff: "nosniff",
                    xssProtection: "sanitize",
                    contentSecurityPolicy: {
                        directives: {
                            defaultSrc: ["'self'"],
                            childSrc: ["'self'"],
                            scriptSrc: scriptSrcs,
                            styleSrc: ["'self'", "'unsafe-inline'"],
                            connectSrc: ["'self'", srcSubDomain],
                            imgSrc: ["'self'", "data:", "blob:", srcSubDomain],
                            fontSrc: ["'self'", "data:", "blob:", srcSubDomain]
                        }
                    }
                })
            }
        ];
    },
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300
        };

        return config;
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "timezone-support$": path.join(__dirname, "node_modules/timezone-support/dist/index-2012-2022.js")
        };

        return config;
    }
};

module.exports = withNextBundleAnalyzer(nextConfig);
