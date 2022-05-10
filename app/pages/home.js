import React from "react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { getCurrentUserFromServer } from "../api/user";

export default function home() {
    return (
        <Box className="d-flex w-100 justify-content-center" sx={{ paddingTop: "100px" }}>
            <Typography variant="h1" className="text-center">
                Accueil Connecté
            </Typography>
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
    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    };
}