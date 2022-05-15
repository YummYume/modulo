/** @type {import('next').NextConfig} */

const { createSecureHeaders } = require("next-secure-headers");
const withNextBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: "true" === process.env.ANALYZE });

const srcSubDomain = "development" === process.env.NODE_ENV ? "'*.modulo.local'" : "'*.modulo-scout.fr'";
const imageSubDomains = "development" === process.env.NODE_ENV ? "*.modulo.local" : "*.modulo-scout.fr";
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
                            connectSrc: ["'self"],
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
    }
};

module.exports = withNextBundleAnalyzer(nextConfig);
