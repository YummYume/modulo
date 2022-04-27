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
            <Box onClick={handleClick} role="presentation" sx={{ position: "fixed", bottom: 16, right: 16 }}>
                <Fab color="primary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </Box>
        </Zoom>
    );
}
