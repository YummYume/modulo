import React from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import List from "@mui/material/List";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useCookies } from "react-cookie";

export default function UserScopeModal({ user, open, handleClose }) {
    const [cookies, setCookie] = useCookies(["current_scope"]);

    const handleScopeSelection = (scope) => {
        setCookie("current_scope", scope.id, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: "lax",
            secure: true
        });
    };

    return (
        <Modal
            aria-labelledby="user-scopes-title"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 1000
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        height: "80%",
                        bgcolor: "primary.main",
                        border: "2px solid",
                        borderColor: "primary.light",
                        borderRadius: "10px",
                        boxShadow: 24,
                        padding: "2rem",
                        color: "primary.text.main"
                    }}
                >
                    <Typography id="user-scopes-title" variant="h3" component="h2" className="text-center">
                        Je choisis ma fonction
                    </Typography>
                    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "primary.main" }} aria-label="scopes">
                        {user.scopes.map((scope) => (
                            <ListItem disablePadding onClick={() => handleScopeSelection(scope)} key={scope.id}>
                                <ListItemButton>
                                    {user.currentScope?.id === scope.id && (
                                        <ListItemIcon>
                                            <CheckIcon />
                                        </ListItemIcon>
                                    )}
                                    <ListItemText primary={`${scope.role.name} - ${scope.structure.name}`} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Fade>
        </Modal>
    );
}
