import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Link from "next/link";

import { useUser } from "../hooks/useUser";
import UserMenu from "./UserMenu";

import styles from "../styles/Navbar.module.scss";

export default function Navbar({ isPageReady, handleModeChange }) {
    const { data: user, isFetched } = useUser();
    const trigger = useScrollTrigger({ disableHysteresis: true });

    return (
        <AppBar color="primary" sx={{ zIndex: 10 }}>
            <Toolbar
                className={`d-flex justify-content-between align-items-center ${trigger ? styles.reducedState : styles.initialState}`}
                classes={{ root: { "min-height": "0px" } }}
            >
                <Link href="/home">
                    <a>
                        <Typography variant="h6">Modulo</Typography>
                    </a>
                </Link>
                <button onClick={handleModeChange}>Mode</button>
                <UserMenu user={user} isFetched={isFetched} isPageReady={isPageReady} />
            </Toolbar>
        </AppBar>
    );
}
