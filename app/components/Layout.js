import React from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <div className="app">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}