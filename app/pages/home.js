import React, { useState } from "react";
import { dehydrate, QueryClient, useQuery, useMutation } from "react-query";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import format from "date-fns/format";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import fr from "date-fns/locale/fr";
import parse from "date-fns/parse";
import { getEvents } from "../api/event";

import { getCurrentUserFromServer } from "../api/user";
import { useUser } from "../hooks/useUser";
import { isGranted, features } from "../services/user";
import AddEventModal from "../components/AddEventModal";
import editEvent from "../api/event";

export default function Home() {
    const [openModal, setOpenModal] = useState(false);
    const { data: events, refetch } = useQuery("events", getEvents, {
        initialData: [],
        refetchOnWindowFocus: false
    });
    const [initialValuesOverride, setInitialValuesOverride] = useState(null);
    const { data: user } = useUser();
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
    const locales = {
        fr
    };
    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales
    });
    const [formMode, setFormMode] = useState();

    const editEventMutation = useMutation(
        (values) =>
            editEvent(
                values.id,
                values.name,
                values.description,
                values.active,
                values.startDate,
                values.endDate,
                values.categories,
                values.participants
            ),
        {
            onSuccess: () => {
                refetch();
                toast.success("Evénement modifié !");
            },

            onError: (error) => {
                if (422 === error?.response?.status) {
                    toast.error("Une erreur est survenue lors de la modification.");
                } else {
                    toast.error("Une erreur est survenue.");
                }
            }
        }
    );

    const handleClose = () => {
        setOpenModal(false);
        setInitialValuesOverride(null);
    };

    const handleNewEvent = () => {
        setFormMode("add");
        setOpenModal(true);
    };

    const handleSelectEvent = (event) => {
        setInitialValuesOverride(event);
        setFormMode("edit");
        setOpenModal(true);
    };

    const handleSelectSlot = ({ start, end }) => {
        handleNewEvent();
        setInitialValuesOverride({ startDate: start, endDate: end });
    };

    const updateEvent = ({ event: { id }, end, start }) => {
        editEventMutation.mutate({
            endDate: end,
            id,
            startDate: start
        });
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
                            startAccessor="startDate"
                            endAccessor="endDate"
                            titleAccessor="name"
                            selectable
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            onEventDrop={updateEvent}
                            resizable
                            onEventResize={updateEvent}
                            culture={"fr"}
                            style={{ height: 500 }}
                        />
                        <Fab color="primary" className="mx-auto d-block my-5" onClick={() => handleNewEvent()}>
                            <AddIcon />
                        </Fab>
                        {openModal && (
                            <AddEventModal
                                editEventMutation={editEventMutation}
                                handleClose={handleClose}
                                initialValuesOverride={initialValuesOverride}
                                mode={formMode}
                                refetch={refetch}
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
