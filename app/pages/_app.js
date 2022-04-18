import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import Head from "next/head";

import Layout from "../components/Layout";
import UserHandler from "../components/UserHandler";
import theme from "../themes/appTheme";

import "../styles/globals.scss";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60
        }
    }
});

function App({ Component, pageProps }) {
    useEffect(() => {
        if (window !== undefined) {
            persistQueryClient({
                queryClient,
                persistor: createWebStoragePersistor({
                    storage: window.localStorage,
                    key: "react-query-persist"
                })
            });
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Head>
                    <title>Modulo</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <UserHandler />
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
