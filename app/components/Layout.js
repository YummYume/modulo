import React from "react";
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
import CookieConsent from "react-cookie-consent";

import Navbar from "./Navbar";
import Footer from "./Footer";

import styles from "../styles/Layout.module.scss";

export default function Layout({ children }) {
    return (
        <Box className={`app d-flex flex-column justify-content-between ${styles.background}`}>
            <Navbar />
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
            >
                Ce site utilise des cookies pour son bon fonctionnement et pour vous garantir une expérience optimale. <a>En savoir plus</a>
            </CookieConsent>
        </Box>
    );
}
