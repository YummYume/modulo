import React from "react";
import { dehydrate, QueryClient } from "react-query";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import { getCurrentUserFromServer } from "../api/user";
import { isGranted, features } from "../services/user";
import { useUser } from "../hooks/useUser";

export default function Home() {
    const localizer = momentLocalizer(moment);
    const { data: user } = useUser();
    const events = [
        {
            id: 0,
            title: "Test",
            allDay: true,
            start: new Date(),
            end: new Date()
        }
    ];

    return (
        <React.Fragment>
            <Head>
                <title>Accueil | Modulo</title>
                <meta name="description" content="Accueil de l'application Modulo." />
            </Head>
            <div className="container-fluid w-100 mx-5">
                <Typography variant="h2" component="h1" className="text-center text-break my-5">
                    Accueil Connecté
                </Typography>
                {isGranted(features.AGENDA_ACCESS, user) && (
                    <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: 500 }} />
                )}
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
