import React, { useState } from "react";
import { ThemeProvider } from "@mui/material";
import { Hydrate, QueryClient, QueryClientProvider, setLogger } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";

import Layout from "../components/Layout";
import UserHandler from "../components/UserHandler";
import ScrollToTop from "../components/ScrollToTop";
import theme from "../themes/appTheme";

import "../styles/globals.scss";

function App({ Component, pageProps }) {
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

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <Head>
                        <title>Modulo</title>
                        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                        <meta name="description" content="L'application Modulo." />
                    </Head>
                    <UserHandler />
                    <Layout>
                        <NextNProgress />
                        <Component {...pageProps} />
                        <ScrollToTop />
                    </Layout>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Hydrate>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
