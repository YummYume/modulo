import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";

export default function Footer() {
    return (
        <Box
            className="w-100 d-flex justify-content-center align-items-center"
            height="100px"
            bgcolor="primary.main"
            color="primary.text.main"
            boxShadow="0 0 25px #000"
            zIndex={1000}
            component="footer"
        >
            <Typography variant="body1" className="text-center" sx={{ padding: "0 10px" }}>
                <Link href="/help">
                    <a>Aide</a>
                </Link>
                {" - "}
                <Link href="/legal-notice">
                    <a>Mentions légales</a>
                </Link>
                {" - "}
                <Link href="/cookie-policy">
                    <a>Gestion des cookies</a>
                </Link>
                {" - "}
                <Link href="/about">
                    <a>À propos</a>
                </Link>
            </Typography>
        </Box>
    );
}
