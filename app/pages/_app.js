import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { Hydrate, QueryClient, QueryClientProvider, setLogger } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useRouter } from "next/router";
import Head from "next/head";

import Layout from "../components/Layout/Layout";
import UserHandler from "../components/UserHandler";
import theme from "../themes/appTheme";

import "../styles/globals.scss";

function App({ Component, pageProps }) {
    const router = useRouter();
    const [isPageReady, setIsPageReady] = useState(true);
    const [queryClient] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    cacheTime: 1000 * 60
                }
            }
        })
    );

    if ("production" === process.env.NODE_ENV) {
        setLogger({
            log: () => {},
            warn: () => {},
            error: () => {}
        });
    }

    const handleRouteChangeStart = () => setIsPageReady(false);
    const handleRouteChangeComplete = () => setIsPageReady(true);
    const handleRouteChangeError = () => setIsPageReady(true);

    useEffect(() => {
        router.events.on("routeChangeStart", handleRouteChangeStart);
        router.events.on("routeChangeComplete", handleRouteChangeComplete);
        router.events.on("routeChangeError", handleRouteChangeError);

        return () => {
            router.events.off("routeChangeStart", handleRouteChangeStart);
            router.events.off("routeChangeComplete", handleRouteChangeComplete);
            router.events.off("routeChangeError", handleRouteChangeError);
        };
    }, [router.events]);

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <Head>
                    <title>Modulo</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta name="description" content="L'application Modulo." />
                    <meta name="theme-color" content="#04263e" />
                    <meta name="og:title" content="Modulo" />
                    <meta name="og:description" content="L'application Modulo." />
                    <meta name="og:url" content={`https://modulo-scout.fr${router.pathname}`} />
                </Head>
                <UserHandler />
                <ThemeProvider theme={theme}>
                    <Layout isPageReady={isPageReady}>
                        <Component {...pageProps} isPageReady={isPageReady} />
                    </Layout>
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </Hydrate>
        </QueryClientProvider>
    );
}

export default App;
