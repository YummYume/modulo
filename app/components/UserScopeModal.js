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
                    position="absolute"
                    top="50%"
                    left="50%"
                    width="35rem"
                    maxWidth="90%"
                    minHeight="40%"
                    bgcolor="primary.main"
                    color="primary.text.main"
                    className="p-4 border border-light rounded"
                    sx={{ transform: "translate(-50%, -50%)" }}
                >
                    <Typography id="user-scopes-title" variant="h4" component="h2" className="text-center">
                        Je choisis ma fonction
                    </Typography>
                    <List aria-label="scopes">
                        {user.scopes.map((scope) => (
                            <ListItem disablePadding onClick={() => handleScopeSelection(scope)} key={scope.id}>
                                <ListItemButton>
                                    {user.currentScope?.id === scope.id && (
                                        <ListItemIcon>
                                            <CheckIcon sx={{ color: "primary.text.main" }} />
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
