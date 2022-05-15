import React from "react";
import { dehydrate, QueryClient } from "react-query";
import Typography from "@mui/material/Typography";
import Head from "next/head";

import { getCurrentUserFromServer } from "../api/user";

export default function Home() {
    return (
        <React.Fragment>
            <Head>
                <title>Modulo | Accueil</title>
                <meta name="description" content="Accueil de l'application Modulo." />
            </Head>
            <div className="container-fluid w-100">
                <Typography variant="h2" component="h1" className="text-center text-break my-2">
                    Accueil Connecté
                </Typography>
            </div>
        </React.Fragment>
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
