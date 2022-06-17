import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import NextNProgress from "nextjs-progressbar";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import { useCookies } from "react-cookie";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { lightTheme, darkTheme } from "../../themes/appTheme";

import styles from "../../styles/Layout.module.scss";

export default function Layout({ children, isPageReady }) {
    const [cookies, setCookie] = useCookies(["color_mode"]);
    const [mode, setMode] = useState("light");
    const [currentTheme, setCurrentTheme] = useState(lightTheme);
    const allowedValues = ["light", "dark"];
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
            mode: mode
        }),
        [mode]
    );

    useEffect(() => {
        if (allowedValues.includes(mode)) {
            setCurrentTheme("dark" === mode ? darkTheme : lightTheme);
            setCookie("color_mode", mode, {
                path: "/",
                maxAge: 60 * 60 * 24 * 365 * 3, // 3 years
                sameSite: "strict",
                secure: true
            });
        }
    }, [mode]);

    useEffect(() => {
        if (cookies.color_mode && allowedValues.includes(cookies.color_mode)) {
            setMode(cookies.color_mode);
        }
    }, []);

    return (
        <ThemeProvider theme={currentTheme}>
            <Box color="primary.text.light" bgcolor="primary.light" className={`d-flex flex-column justify-content-between ${styles.app}`}>
                <NextNProgress color={currentTheme.palette.loading.color} options={{ showSpinner: false }} />
                <Navbar isPageReady={isPageReady} colorMode={colorMode} />
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
