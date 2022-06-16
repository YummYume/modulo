import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/router";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import { useUserSwitchScope } from "../hooks/useUserSwitchScope";

export default function UserScopeModal({ user, open, handleClose, isPageReady }) {
    const [selectedScope, setSelectedScope] = useState(null);
    const router = useRouter();
    const onMutationPostSuccess = async () => {
        if (router.pathname !== "/home") {
            await router.push("/home");
        }

        handleClose();
    };
    const onMutationFailure = () => {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
    };
    const userSwitchScope = useUserSwitchScope(null, onMutationPostSuccess, onMutationFailure);

    const handleScopeSelection = (scope) => {
        if (!userSwitchScope.isLoading && isPageReady) {
            setSelectedScope(scope);
        }
    };

    const handleScopeConfirmation = () => {
        if (null !== selectedScope) {
            userSwitchScope.mutate(selectedScope.id);
        }
    };

    const handleOnClose = () => {
        if (!userSwitchScope.isLoading && isPageReady) {
            handleClose();
        }
    };

    useEffect(() => {
        if (Boolean(user)) {
            setSelectedScope(user.currentScope); // this is required to avoid difference between ssr and csr
        } else {
            setSelectedScope(null);
        }
    }, [user]);

    return (
        <Modal
            aria-labelledby="user-scopes-title"
            open={open}
            onClose={handleOnClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 1000
            }}
        >
            <Fade timeout={500} in={open}>
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    width="35rem"
                    maxWidth="90%"
                    minHeight="40%"
                    bgcolor="box.secondaryBox.background"
                    color="box.secondaryBox.color"
                    className="p-4 border border-light rounded d-flex flex-column"
                    sx={{ transform: "translate(-50%, -50%)" }}
                >
                    <IconButton
                        className="position-absolute top-0 end-0 m-1"
                        aria-label="close"
                        size="large"
                        onClick={handleOnClose}
                        disabled={!isPageReady || userSwitchScope.isLoading}
                    >
                        <CloseIcon sx={{ color: "primary.text.main" }} fontSize="inherit" />
                    </IconButton>
                    <Typography id="user-scopes-title" variant="h4" component="h2" className="text-center">
                        Je choisis ma fonction
                    </Typography>
                    <List aria-label="scopes" className="flex-grow-1">
                        {user.scopes.map((scope) => (
                            <ListItem disablePadding onClick={() => handleScopeSelection(scope)} key={scope.id}>
                                <ListItemButton>
                                    {selectedScope?.id === scope.id && (
                                        <ListItemIcon>
                                            <CheckIcon sx={{ color: "primary.text.main" }} />
                                        </ListItemIcon>
                                    )}
                                    <ListItemText primary={`${scope.role.name} - ${scope.structure.name}`} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <div className="text-center">
                        <LoadingButton
                            variant="text"
                            endIcon={<ArrowForward />}
                            id="confirm-scope-choice"
                            loading={userSwitchScope.isLoading}
                            loadingPosition="end"
                            disabled={!isPageReady || null === selectedScope}
                            onClick={handleScopeConfirmation}
                            size="large"
                            sx={{
                                color: "primary.text.main"
                            }}
                        >
                            Changer de fonction
                        </LoadingButton>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
}
