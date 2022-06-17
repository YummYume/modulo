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
import SettingsIcon from "@mui/icons-material/Settings";
import Fade from "@mui/material/Fade";
import SecurityIcon from "@mui/icons-material/Security";

import { useUserLogout } from "../hooks/useUserLogout";
import { adminRoles } from "../services/user";
import UserScopeModal from "./UserScopeModal";
import UserAvatar from "./UserAvatar";
import UserPreferencesModal from "./UserPreferencesModal";
import DarkMenu from "./Mui/DarkMenu";

export default function UserMenu({ user, isFetched, isPageReady, colorMode }) {
    const router = useRouter();
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const [userScopeModalOpen, setUserScopeModalOpen] = useState(false);
    const [userPreferencesModalOpen, setUserPreferencesModalOpen] = useState(false);
    const userMenuOpen = Boolean(userMenuAnchorEl);
    const logoutMutation = useUserLogout(null, null, () => setUserMenuAnchorEl(null));

    const handleUserModalOpen = () => setUserScopeModalOpen(true);
    const handleUserModalClose = () => setUserScopeModalOpen(false);
    const handleUserPreferencesOpen = () => setUserPreferencesModalOpen(true);
    const handleUserPreferencesClose = () => setUserPreferencesModalOpen(false);
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
        onClose: handleUserMenuClose,
        TransitionComponent: Fade
    };

    const UserPreferencesMenuItem = () => {
        return (
            <MenuItem disabled={Boolean(user) && logoutMutation.isLoading} onClick={handleUserPreferencesOpen}>
                <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body1">Mes préférences</Typography>
            </MenuItem>
        );
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
                        <DarkMenu {...menuProps}>
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
                            <UserPreferencesMenuItem />
                            {Boolean(user.roles) && user.roles.some((r) => adminRoles().indexOf(r) >= 0) && (
                                <MenuItem
                                    disabled={logoutMutation.isLoading}
                                    onClick={() => (window.location.href = process.env.NEXT_PUBLIC_ADMIN_SITE_URL)}
                                >
                                    <ListItemIcon>
                                        <SecurityIcon fontSize="small" />
                                    </ListItemIcon>
                                    <Typography variant="body1">Administration</Typography>
                                </MenuItem>
                            )}
                            <MenuItem disabled={logoutMutation.isLoading} onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body1" className="d-flex flex-grow-1 align-items-center justify-content-between">
                                    Déconnexion{" "}
                                    {logoutMutation.isLoading && <CircularProgress size={16} sx={{ color: "box.mainBox.color" }} />}
                                </Typography>
                            </MenuItem>
                        </DarkMenu>
                    ) : (
                        <DarkMenu {...menuProps}>
                            <MenuItem onClick={handleLoginRedirect}>
                                <ListItemIcon>
                                    <LoginIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body1">Connexion</Typography>
                            </MenuItem>
                            <UserPreferencesMenuItem />
                        </DarkMenu>
                    )}
                </React.Fragment>
            ) : (
                <Menu {...menuProps}>
                    <CircularProgress size={16} sx={{ margin: 1 }} />
                </Menu>
            )}
            {user && <UserScopeModal user={user} open={userScopeModalOpen} handleClose={handleUserModalClose} isPageReady={isPageReady} />}
            <UserPreferencesModal open={userPreferencesModalOpen} handleClose={handleUserPreferencesClose} colorMode={colorMode} />
        </div>
    );
}
