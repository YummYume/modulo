import React, { useEffect } from "react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import Box from "@mui/material/Box";

import { getRoles } from "../api/roles";
import { useUser } from "../hooks/useUser";
import { refresh } from "../api/user";

export default function Roles({ userData }) {
    const { data: user } = useUser();
    const { isLoading, isError, data, error } = useQuery("roles", getRoles, {
        refetchInterval: 10000,
        enabled: (user && user.data) !== false
    });

    const test = async () => {
        const res = await fetch(`https://modulo.local/api/refresh-token`);
        console.log(res);
    };

    useEffect(() => {
        test();
    }, []);

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

export async function getServerSideProps(context) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery("user", refresh);

    // const res = await fetch(`https://modulo.local/api/refresh-token`);
    // const data = await res.json();

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    };
}
