import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import UserIcon from "@mui/icons-material/AccountCircle";
import BadgeIcon from "@mui/icons-material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import AvatarIcon from "@mui/icons-material/AccountCircle";

import { useUserLogout } from "../hooks/useUserLogout";
import UserScopeModal from "./UserScopeModal";

export default function UserMenu({ user }) {
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const [userScopeModalOpen, setUserScopeModalOpen] = useState(false);
    const userMenuOpen = Boolean(userMenuAnchorEl);
    const logoutMutation = useUserLogout(null, null, () => setUserMenuAnchorEl(null));

    const handleUserModalOpen = () => setUserScopeModalOpen(true);
    const handleUserModalClose = () => setUserScopeModalOpen(false);
    const handleUserMenuOpen = (event) => setUserMenuAnchorEl(event.currentTarget);
    const handleUserMenuClose = () => !logoutMutation.isLoading && setUserMenuAnchorEl(null);
    const handleLogout = () => logoutMutation.mutate();

    return (
        <Box>
            {user ? (
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
                        <MenuItem disabled={logoutMutation.isLoading}>
                            <ListItemIcon>
                                <AvatarIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body1">{user.fullName}</Typography>
                        </MenuItem>
                        <MenuItem disabled={logoutMutation.isLoading} onClick={handleUserModalOpen}>
                            <ListItemIcon>
                                <BadgeIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body1">Mes fonctions</Typography>
                        </MenuItem>
                        <MenuItem disabled={logoutMutation.isLoading} onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body1">
                                Déconnexion{" "}
                                {logoutMutation.isLoading && (
                                    <CircularProgress
                                        size={16}
                                        sx={{ position: "absolute", right: 0, top: "50%", marginTop: "-8px", marginRight: 1 }}
                                    />
                                )}
                            </Typography>
                        </MenuItem>
                    </Menu>
                    <UserScopeModal user={user} open={userScopeModalOpen} handleClose={handleUserModalClose} />
                </Box>
            ) : (
                <Link href="/">
                    <a>
                        <Typography variant="body1">Connexion</Typography>
                    </a>
                </Link>
            )}
        </Box>
    );
}
