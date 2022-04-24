import React from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <div className="app d-flex flex-column justify-content-between">
            <Navbar />
            <main className="d-flex flex-grow-1 container-fluid">{children}</main>
            <Footer />
        </div>
    );
}
