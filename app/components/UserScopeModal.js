import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import CheckIcon from "@mui/icons-material/Check";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/router";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForward from "@mui/icons-material/ArrowForward";

import SecondaryModal from "./SecondaryModal";
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
        <SecondaryModal
            open={open}
            handleClose={handleOnClose}
            disabled={!isPageReady || userSwitchScope.isLoading}
            title="Je choisis ma fonction"
            labelId="user-scopes-title"
        >
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
        </SecondaryModal>
    );
}
