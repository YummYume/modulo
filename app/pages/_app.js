import React from "react";
import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import Layout from "../components/Layout";
import theme from "../themes/appTheme";

import "../styles/globals.scss";

function App({ Component, pageProps }) {
    const queryClient = new QueryClient();

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
