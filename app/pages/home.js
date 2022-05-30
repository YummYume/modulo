import React, { useState } from "react";
import { dehydrate, QueryClient } from "react-query";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import "moment/locale/fr";

import { getCurrentUserFromServer } from "../api/user";
import { useUser } from "../hooks/useUser";
import { isGranted, features } from "../services/user";
import AddEventModal from "../components/AddEventModal";

moment.locale("fr");

export default function Home() {
    const [openModal, setOpenModal] = useState(false);
    const { data: user } = useUser();
    const localizer = momentLocalizer(moment);
    const messages = {
        date: "Date",
        time: "Heure",
        event: "Evénement",
        allDay: "Toute la journée",
        week: "Semaine",
        work_week: "Semaine de travail",
        day: "Jour",
        month: "Mois",
        previous: "Précédent",
        next: "Suivant",
        yesterday: "Hier",
        tomorrow: "Demain",
        today: "Aujourd'hui",
        agenda: "Agenda",

        noEventsInRange: "Il n'y a pas d'événements dans cette période.",

        showMore: (total) => `+${total} plus`
    };
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
                    <React.Fragment>
                        <Calendar
                            messages={messages}
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                        />
                        <Fab color="primary" className="mx-auto d-block my-5" onClick={() => setOpenModal(true)}>
                            <AddIcon />
                        </Fab>
                    </React.Fragment>
                )}
                <AddEventModal openModal={openModal} setOpenModal={setOpenModal} user={user} />
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
