import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import BadgeIcon from "@mui/icons-material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import AvatarIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/LoginTwoTone";
import { useRouter } from "next/router";

import { useUserLogout } from "../hooks/useUserLogout";
import UserScopeModal from "./UserScopeModal";
import UserAvatar from "./UserAvatar";

export default function UserMenu({ user, isFetched, isPageReady }) {
    const router = useRouter();
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const [userScopeModalOpen, setUserScopeModalOpen] = useState(false);
    const userMenuOpen = Boolean(userMenuAnchorEl);
    const logoutMutation = useUserLogout(null, null, () => setUserMenuAnchorEl(null));

    const handleUserModalOpen = () => setUserScopeModalOpen(true);
    const handleUserModalClose = () => setUserScopeModalOpen(false);
    const handleUserMenuOpen = (event) => setUserMenuAnchorEl(event.currentTarget);
    const handleUserMenuClose = () => !logoutMutation.isLoading && setUserMenuAnchorEl(null);
    const handleLogout = () => logoutMutation.mutate();
    const handleLoginRedirect = () => {
        setUserMenuAnchorEl(null);

        "/" !== router.pathname && router.push("/");
    };
    const menuProps = {
        id: "user-menu",
        anchorEl: userMenuAnchorEl,
        transformOrigin: {
            vertical: "top",
            horizontal: "right"
        },
        open: userMenuOpen,
        onClose: handleUserMenuClose
    };

    return (
        <div>
            <UserAvatar
                avatarProps={{
                    id: "user-icon",
                    onClick: handleUserMenuOpen,
                    "aria-controls": userMenuOpen ? "user-menu" : undefined,
                    "aria-haspopup": "true",
                    "aria-expanded": userMenuOpen ? "true" : undefined
                }}
                user={user}
            />
            {isFetched ? (
                <React.Fragment>
                    {user ? (
                        <Menu {...menuProps}>
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
                    ) : (
                        <Menu {...menuProps}>
                            <MenuItem onClick={handleLoginRedirect}>
                                <ListItemIcon>
                                    <LoginIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body1">Connexion</Typography>
                            </MenuItem>
                        </Menu>
                    )}
                </React.Fragment>
            ) : (
                <Menu {...menuProps}>
                    <CircularProgress size={16} sx={{ margin: 1 }} />
                </Menu>
            )}
            {user && <UserScopeModal user={user} open={userScopeModalOpen} handleClose={handleUserModalClose} isPageReady={isPageReady} />}
        </div>
    );
}
