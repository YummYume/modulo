import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import NextNProgress from "nextjs-progressbar";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../components/ScrollToTop";
import { lightTheme, darkTheme } from "../themes/appTheme";

import styles from "../styles/Layout.module.scss";

export default function Layout({ children, isPageReady }) {
    const theme = useTheme();
    const [mode, setMode] = useState("light");
    const [currentTheme, setCurrentTheme] = useState(lightTheme);
    const colorMode = useMemo(
        () => ({
            // The dark mode switch would invoke this method
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            }
        }),
        []
    );
    const handleModeChange = () => {
        setMode("light" === mode ? "dark" : "light");
    };

    useEffect(() => {
        setCurrentTheme("light" === mode ? lightTheme : darkTheme);
    }, [mode]);

    return (
        <ThemeProvider theme={currentTheme}>
            <Box bgcolor="primary.main" className={`d-flex flex-column justify-content-between ${styles.app}`}>
                <NextNProgress color={theme.palette.primary.light} options={{ showSpinner: false }} />
                <Navbar isPageReady={isPageReady} handleModeChange={handleModeChange} />
                <main className="d-flex flex-grow-1">{children}</main>
                <Footer />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    closeOnClick={true}
                    pauseOnHover={true}
                    draggable={true}
                    progress={undefined}
                    theme="colored"
                    style={{ top: "5rem" }}
                />
                <CookieConsent
                    location="bottom"
                    buttonText="Je comprends"
                    cookieName="cookie_consent"
                    cookieValue={true}
                    cookieSecurity={true}
                    sameSite="strict"
                    acceptOnScroll={false}
                    enableDeclineButton={false}
                    expires={365}
                    debug={false}
                    buttonStyle={{ backgroundColor: currentTheme.palette.primary.text.main, color: currentTheme.palette.primary.main }}
                    buttonClasses="rounded py-2"
                    buttonId="cookie-consent-accept"
                    style={{ backgroundColor: currentTheme.palette.secondary.main }}
                >
                    Ce site utilise des cookies pour son bon fonctionnement et pour vous garantir une expérience optimale.{" "}
                    <Link href="/cookie-policy">
                        <a>En savoir plus</a>
                    </Link>
                </CookieConsent>
                <ScrollToTop />
            </Box>
        </ThemeProvider>
    );
}
