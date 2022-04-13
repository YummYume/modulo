import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Navbar() {
    return (
        <AppBar position="static" color="primaryBlue">
            <Toolbar>
                <Typography variant="h6">Modulo</Typography>
            </Toolbar>
        </AppBar>
    );
}
