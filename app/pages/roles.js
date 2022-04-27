import React from "react";
import { useQuery } from "react-query";
import Box from "@mui/material/Box";

import { getRoles } from "../api/roles";
import { useUser } from "../hooks/useUser";

export default function Roles() {
    const { data: user } = useUser();
    const { isLoading, isError, data, error } = useQuery("roles", getRoles, {
        refetchInterval: 10000,
        enabled: (user && user.data) !== false
    });

    return (
        <Box sx={{ paddingTop: "100px" }}>
            <h1>Roles</h1>
            {isLoading && <p>Chargement...</p>}
            {isError && <p>Erreur: {error.message}</p>}
            {data && (
                <ul>
                    {data["hydra:member"].map((role) => (
                        <li key={role.id}>{role.name}</li>
                    ))}
                </ul>
            )}
        </Box>
    );
}
