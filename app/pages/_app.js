import React, { useState } from "react";
import { ThemeProvider } from "@mui/material";
import { Hydrate, QueryClient, QueryClientProvider, setLogger } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Head from "next/head";

import Layout from "../components/Layout";
import UserHandler from "../components/UserHandler";
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
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <Head>
                    <title>Modulo</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta name="description" content="L'application Modulo." />
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
