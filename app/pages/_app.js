import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import Head from "next/head";

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

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <Head>
                        <title>Modulo</title>
                        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    </Head>
                    <UserHandler />
                    <Layout>
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
