import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/system";

export default function Footer() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: "100%",
                height: "100px",
                backgroundColor: theme.palette.primaryBlue.main,
                color: theme.palette.primaryBlue.contrastText,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bottom: 0,
                position: "absolute"
            }}
            component="footer"
        >
            <Typography variant="h6">
                <a>Aide</a> - <a>Mentions légales</a> - <a>Gestion des cookies</a> - <a>À propos</a>
            </Typography>
        </Box>
    );
}
