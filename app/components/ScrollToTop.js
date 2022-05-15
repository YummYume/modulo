import React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollTop() {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100
    });

    const handleClick = () => {
        if (window !== undefined) {
            window.scrollTo(0, 0);
        }
    };

    return (
        <Zoom in={trigger}>
            <Box onClick={handleClick} role="presentation" position="fixed" bottom="16px" right="16px" zIndex="9999">
                <Fab color="primary" size="small" aria-label="Revenir en haut">
                    <KeyboardArrowUpIcon />
                </Fab>
            </Box>
        </Zoom>
    );
}
