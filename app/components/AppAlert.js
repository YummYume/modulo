import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function AppAlert({ message, severity, open }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setIsOpen(false);
    };

    return (
        <Snackbar open={isOpen} anchorOrigin={{ vertical: "top", horizontal: "right" }} sx={{ width: 300 }}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
}
