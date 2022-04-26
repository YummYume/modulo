import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AppAlert({ message, severity, open }) {
    useEffect(() => {
        if (open) {
            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        }
    }, []);

    return null;
}
