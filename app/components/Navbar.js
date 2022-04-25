import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import UserIcon from "@mui/icons-material/AccountCircle";
import useScrollTrigger from "@mui/material/useScrollTrigger";

import { useUser } from "../hooks/useUser";
import { useUserLogout } from "../hooks/useUserLogout";

import styles from "../styles/Navbar.module.scss";

export default function Navbar() {
    const { data: user } = useUser();
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const userMenuOpen = Boolean(userMenuAnchorEl);
    const logoutMutation = useUserLogout();
    const trigger = useScrollTrigger({ disableHysteresis: true });

    const handleUserMenuOpen = (event) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const handleLogout = () => {
        setUserMenuAnchorEl(null);
        logoutMutation.mutate();
    };

    const rightSide = (
        <Box>
            {user && user.data ? (
                <Box>
                    <UserIcon
                        id="user-icon"
                        onClick={handleUserMenuOpen}
                        aria-controls={userMenuOpen ? "user-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={userMenuOpen ? "true" : undefined}
                    />
                    <Menu
                        id="user-menu"
                        anchorEl={userMenuAnchorEl}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        open={userMenuOpen}
                        onClose={handleUserMenuClose}
                    >
                        <MenuItem>
                            <Typography variant="h6">{user.data.fullName}</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <Typography variant="h6">Déconnexion</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            ) : (
                <Link href="/">
                    <a>
                        <Typography variant="h6">Connexion</Typography>
                    </a>
                </Link>
            )}
        </Box>
    );

    return (
        <AppBar color="primary">
            <Toolbar
                className={`d-flex justify-content-between align-items-center ${trigger ? styles.reducedState : styles.initialState}`}
                classes={{ root: { "min-height": "0px" } }}
            >
                <Typography variant="h6">Modulo</Typography>
                {rightSide}
            </Toolbar>
        </AppBar>
    );
}
