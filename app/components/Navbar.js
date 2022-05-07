import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";

import { useUser } from "../hooks/useUser";
import UserMenu from "./UserMenu";

import styles from "../styles/Navbar.module.scss";

export default function Navbar() {
    const { data: user } = useUser();
    const trigger = useScrollTrigger({ disableHysteresis: true });

    return (
        <AppBar color="primary">
            <Toolbar
                className={`d-flex justify-content-between align-items-center ${trigger ? styles.reducedState : styles.initialState}`}
                classes={{ root: { "min-height": "0px" } }}
            >
                <Typography variant="h6">Modulo</Typography>
                <UserMenu user={user} />
            </Toolbar>
        </AppBar>
    );
}
