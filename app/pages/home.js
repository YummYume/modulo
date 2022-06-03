import React, { useCallback, useState } from "react";
import { dehydrate, QueryClient } from "react-query";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import "moment/locale/fr";
import "moment-timezone";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { getCurrentUserFromServer } from "../api/user";
import { useUser } from "../hooks/useUser";
import { isGranted, features } from "../services/user";
import AddEventModal from "../components/AddEventModal";

moment.locale("fr");

export default function Home() {
    const [openModal, setOpenModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [initialValuesOverride, setInitialValuesOverride] = useState(null);
    const { data: user } = useUser();
    const localizer = momentLocalizer(moment);
    const DnDCalendar = withDragAndDrop(Calendar);
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

    const handleClose = () => {
        setOpenModal(false);
        setInitialValuesOverride(null);
    };

    const handleSelectSlot = ({ start, end }) => {
        setOpenModal(true);
        setInitialValuesOverride({ startDate: start, endDate: end });
    };

    const handleSelectEvent = useCallback((event) => window.alert(event.title), []);

    const handleResize = ({ event, start, end }) => {
        console.log(event);
    };

    return (
        <React.Fragment>
            <Head>
                <title>Accueil | Modulo</title>
                <meta name="description" content="Accueil de l'application Modulo." />
            </Head>
            <div className="container-fluid mx-sm-5">
                <Typography variant="h2" component="h1" className="text-center text-break my-5">
                    Accueil Connecté
                </Typography>
                {isGranted(features.AGENDA_ACCESS, user) && (
                    <React.Fragment>
                        <DnDCalendar
                            messages={messages}
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            selectable
                            onSelectEvent={handleSelectEvent}
                            onSelectSlot={handleSelectSlot}
                            resizable
                            onEventResize={handleResize}
                            style={{ height: 500 }}
                        />
                        <Fab color="primary" className="mx-auto d-block my-5" onClick={() => setOpenModal(true)}>
                            <AddIcon />
                        </Fab>
                        {openModal && (
                            <AddEventModal
                                handleClose={handleClose}
                                initialValuesOverride={initialValuesOverride}
                                setEvents={setEvents}
                                user={user}
                            />
                        )}
                    </React.Fragment>
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
