import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
    const theme = useTheme();

    return (
        <Box
            className="w-100 d-flex justify-content-center align-items-center"
            sx={{
                height: "100px",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.text.main
            }}
            component="footer"
        >
            <Typography variant="body1">
                <a href="#">Aide</a> - <a href="#">Mentions légales</a> - <a href="#">Gestion des cookies</a> - <a href="#">À propos</a>
            </Typography>
        </Box>
    );
}
