import React, { useState } from "react";
import { ThemeProvider } from "@mui/material";
import { Hydrate, QueryClient, QueryClientProvider, setLogger } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useRouter } from "next/router";
import Head from "next/head";

import Layout from "../components/Layout";
import UserHandler from "../components/UserHandler";
import theme from "../themes/appTheme";

import "../styles/globals.scss";

function App({ Component, pageProps }) {
    const router = useRouter();
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
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </Hydrate>
        </QueryClientProvider>
    );
}

export default App;
