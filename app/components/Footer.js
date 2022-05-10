import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

export default function Footer() {
    const theme = useTheme();

    return (
        <Box
            className="w-100 d-flex justify-content-center align-items-center"
            sx={{
                height: "100px",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.text.main,
                boxShadow: "0 0 25px #000"
            }}
            component="footer"
        >
            <Typography variant="body1">
                <Link href="/help">
                    <a>Aide</a>
                </Link>{" "}
                -{" "}
                <Link href="/legal-notice">
                    <a>Mentions légales</a>
                </Link>{" "}
                -{" "}
                <Link href="/cookie-policy">
                    <a>Gestion des cookies</a>
                </Link>{" "}
                -{" "}
                <Link href="/about">
                    <a>À propos</a>
                </Link>
            </Typography>
        </Box>
    );
}
