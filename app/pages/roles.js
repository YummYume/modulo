import React from "react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import Box from "@mui/material/Box";

import { getRoles, getRolesFromServer } from "../api/roles";
import { toastAlert } from "../mixins/toastAlert";
import { getCurrentUserFromServer } from "../api/user";

export default function Roles() {
    const { isLoading, data } = useQuery("roles", getRoles, {
        refetchInterval: 30000,
        onError: () => {
            toastAlert("error", "Impossible de récupérer les rôles.");
        }
    });

    return (
        <Box sx={{ paddingTop: "100px" }}>
            <h1>Roles</h1>
            {isLoading && <p>Chargement...</p>}
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

export async function getServerSideProps({ req }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.fetchQuery("user", () => getCurrentUserFromServer(req.headers.cookie));
    } catch (error) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            },
            props: {}
        };
    }
    await queryClient.prefetchQuery("roles", () => getRolesFromServer(req.headers.cookie));

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    };
}
