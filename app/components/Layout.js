import React from "react";
import Box from "@mui/material/Box";

import Navbar from "./Navbar";
import Footer from "./Footer";

import styles from "../styles/Layout.module.scss";

export default function Layout({ children }) {
    return (
        <Box className={`app d-flex flex-column justify-content-between ${styles.background}`}>
            <Navbar />
            <main className="d-flex flex-grow-1">{children}</main>
            <Footer />
        </Box>
    );
}
