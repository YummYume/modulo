import React, { useState } from "react";
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from "react-query";
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
import { toast } from "react-toastify";

import { getCurrentUserFromServer } from "../api/user";
import { useUser } from "../hooks/useUser";
import { isGranted, features } from "../services/user";
import { getEvents, getEventsFromServer, addEvent, editEvent } from "../api/event";
import AddEventModal from "../components/AddEventModal";

export default function Home() {
    const queryClient = useQueryClient();
    const [openModal, setOpenModal] = useState(false);
    const { data: user } = useUser();
    const { data: events } = useQuery("events", getEvents, {
        initialData: [],
        refetchOnWindowFocus: true,
        refetchInterval: 60000,
        enabled: isGranted(features.AGENDA_ACCESS, user)
    });
    const [initialValuesOverride, setInitialValuesOverride] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
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

        showMore: (total) => `+${total} événement${total > 1 ? "s" : ""}`
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
    const addEventMutation = useMutation((values) => addEvent(values, user.currentScope["@id"]), {
        onSuccess: ({ data }) => {
            queryClient.setQueryData("events", (events) => [...events, data]);
            toast.success(`Evénement ${data.name} ajouté avec succès.`);
            handleClose();
        },
        onError: (error) => {
            let message = "Une erreur est survenue.";

            if (422 === error?.response?.status) {
                message = "Une erreur est survenue lors de l'ajout.";
            } else if (403 === error?.response?.status) {
                message = "Vous n'êtes pas autorisé à ajouter un événement.";
            }

            toast.error(message);
        }
    });
    const editEventMutation = useMutation((data) => editEvent(data.id, data.values, user.currentScope["@id"]), {
        onMutate: async (data) => {
            await queryClient.cancelQueries("events");

            const previousEvents = queryClient.getQueryData("events");
            console.log(data, previousEvents);

            queryClient.setQueryData("events", (currentEvent) =>
                currentEvent.map((event) => (event["@id"] === data?.id ? { ...event, ...data?.values } : event))
            );

            return previousEvents;
        },
        onSuccess: ({ data }) => {
            toast.success(`Evénement ${data.name} modifié avec succès.`);
            handleClose();
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData("events", context.previousEvents);

            let message = "Une erreur est survenue.";

            if (422 === error?.response?.status) {
                message = "Une erreur est survenue lors de la modification.";
            } else if (403 === error?.response?.status) {
                message = "Vous n'êtes pas autorisé à modifier cet événement.";
            }

            toast.error(message);
        },
        onSettled: () => {
            queryClient.invalidateQueries("events");
        }
    });

    const handleClose = () => {
        setOpenModal(false);
        setSelectedEvent(null);
        setInitialValuesOverride(null);
    };

    const handleNewEvent = () => {
        setSelectedEvent(null);
        setOpenModal(true);
    };

    const handleSelectEvent = (event) => {
        setInitialValuesOverride(event);
        setSelectedEvent(event);
        setOpenModal(true);
    };

    const handleSelectSlot = ({ start, end }) => {
        setInitialValuesOverride({ startDate: start, endDate: end });
        handleNewEvent();
    };

    const updateEvent = ({ event, end, start }) => {
        editEventMutation.mutate({
            id: event["@id"],
            values: {
                endDate: end,
                startDate: start
            }
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
                )}
                {isGranted(features.EVENT_CRUD, user) && (
                    <React.Fragment>
                        <Fab color="primary" className="mx-auto d-block my-5" onClick={() => handleNewEvent()}>
                            <AddIcon />
                        </Fab>
                        <AddEventModal
                            addEventMutation={addEventMutation}
                            editEventMutation={editEventMutation}
                            handleClose={handleClose}
                            initialValuesOverride={initialValuesOverride}
                            open={openModal}
                            user={user}
                            selectedEvent={selectedEvent}
                        />
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
}

export async function getServerSideProps({ req }) {
    const queryClient = new QueryClient();
    let user;

    try {
        user = await queryClient.fetchQuery("user", () => getCurrentUserFromServer(req.headers.cookie));
    } catch (error) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            },
            props: {}
        };
    }

    //if (Boolean(user) && isGranted(features.AGENDA_ACCESS, user)) {
    //await queryClient.prefetchQuery("events", () => getEventsFromServer(req.headers.cookie));
    //}

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    };
}
