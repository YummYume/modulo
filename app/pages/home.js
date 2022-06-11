import React, { useState, useEffect, useRef } from "react";
import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from "react-query";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import format from "date-fns/format";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import fr from "date-fns/locale/fr";
import parse from "date-fns/parse";
import { toast, Flip } from "react-toastify";
import { zonedTimeToUtc } from "date-fns-tz";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { getCurrentUserFromServer } from "../api/user";
import { useUser } from "../hooks/useUser";
import { isGranted, features } from "../services/user";
import { getEvents, getEventsFromServer, addEvent, editEvent } from "../api/event";
import AddEventModal from "../components/AddEventModal";

export default function Home({ isPageReady }) {
    const queryClient = useQueryClient();
    const [openModal, setOpenModal] = useState(false);
    const [canView, setCanView] = useState(false);
    const [crudAllowed, setCrudAllowed] = useState(false);
    const [actionEnabled, setActionEnabled] = useState(false);
    const [initialValuesOverride, setInitialValuesOverride] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [defaultView, setDefaultView] = useState("month");
    const [defaultDate, setDefaultDate] = useState(new Date());
    const eventStatusToast = useRef(null);
    const { data: user } = useUser();
    const { data: events, refetch: refetchEvents } = useQuery("events", getEvents, {
        initialData: [],
        refetchOnWindowFocus: false,
        refetchInterval: 60000,
        enabled: canView,
        select: (data) => {
            return data.map((event) => ({
                ...event,
                startDate: event.startDate ? zonedTimeToUtc(event.startDate, "Etc/Universal") : null,
                endDate: event.endDate ? zonedTimeToUtc(event.endDate, "Etc/Universal") : null
            }));
        }
    });
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
    const addEventMutation = useMutation((values) => addEvent(values), {
        onMutate: () => {
            eventStatusToast.current = toast.loading(`Ajout de l'événement en cours...`);
        },
        onSuccess: ({ data }) => {
            if (toast.isActive(eventStatusToast.current)) {
                toast.update(eventStatusToast.current, {
                    render: `Evénement ${data.name} ajouté avec succès.`,
                    type: toast.TYPE.SUCCESS,
                    autoClose: 5000,
                    isLoading: false,
                    closeButton: true,
                    closeOnClick: true,
                    draggable: true,
                    transition: Flip
                });
            } else {
                toast.success(`Evénement ${data.name} ajouté avec succès.`);
            }

            queryClient.setQueryData("events", (events) => [...events, data]);
            handleClose();
        },
        onError: (error) => {
            let message = "Une erreur est survenue.";

            if (422 === error?.response?.status) {
                message = "Une erreur est survenue lors de l'ajout.";
            } else if (403 === error?.response?.status) {
                message = "Vous n'êtes pas autorisé à ajouter un événement.";
            }

            if (toast.isActive(eventStatusToast.current)) {
                toast.update(eventStatusToast.current, {
                    render: message,
                    type: toast.TYPE.ERROR,
                    autoClose: 5000,
                    isLoading: false,
                    closeButton: true,
                    closeOnClick: true,
                    draggable: true,
                    transition: Flip
                });
            } else {
                toast.error(message);
            }
        }
    });
    const editEventMutation = useMutation((data) => editEvent(data.id, data.values), {
        onMutate: async (data) => {
            eventStatusToast.current = toast.loading(`Modification de l'événement en cours...`);

            await queryClient.cancelQueries("events");

            const previousEvents = queryClient.getQueryData("events");

            queryClient.setQueryData("events", (currentEvent) =>
                currentEvent.map((event) => (event["@id"] === data?.id ? { ...event, ...data?.values } : event))
            );

            return previousEvents;
        },
        onSuccess: ({ data }) => {
            queryClient.setQueryData("events", (currentEvent) =>
                currentEvent.map((event) => (event["@id"] === data?.id ? { ...event, ...data?.values } : event))
            );

            if (toast.isActive(eventStatusToast.current)) {
                toast.update(eventStatusToast.current, {
                    render: `Evénement ${data.name} modifié avec succès.`,
                    type: toast.TYPE.SUCCESS,
                    autoClose: 5000,
                    isLoading: false,
                    closeButton: true,
                    closeOnClick: true,
                    draggable: true,
                    transition: Flip
                });
            } else {
                toast.success(`Evénement ${data.name} modifié avec succès.`);
            }

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

            if (toast.isActive(eventStatusToast.current)) {
                toast.update(eventStatusToast.current, {
                    render: message,
                    type: toast.TYPE.ERROR,
                    autoClose: 5000,
                    isLoading: false,
                    closeButton: true,
                    closeOnClick: true,
                    draggable: true,
                    transition: Flip
                });
            } else {
                toast.error(message);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries("events");
        }
    });

    useEffect(() => {
        if (Boolean(user)) {
            setCanView(isGranted(features.AGENDA_ACCESS, user));
            setCrudAllowed(isGranted(features.EVENT_CRUD, user));
            refetchEvents();
        }
    }, [user]);

    useEffect(() => {
        setActionEnabled(crudAllowed && !addEventMutation.isLoading && !editEventMutation.isLoading && isPageReady);
    }, [crudAllowed, addEventMutation, editEventMutation, isPageReady]);

    const handleClose = () => {
        setOpenModal(false);
        setSelectedEvent(null);
        setInitialValuesOverride(null);
    };

    const handleNewEvent = (date = null) => {
        if (actionEnabled) {
            date && setDefaultDate(date);
            setSelectedEvent(null);
            setOpenModal(true);
        }
    };

    const handleSelectEvent = (event) => {
        if (actionEnabled) {
            event?.startDate && setDefaultDate(event.startDate);
            setInitialValuesOverride(event);
            setSelectedEvent(event);
            setOpenModal(true);
        }
    };

    const handleSelectSlot = ({ start, end }) => {
        if (actionEnabled) {
            setInitialValuesOverride({ startDate: start, endDate: end });
            handleNewEvent(start);
        }
    };

    const updateEvent = ({ event, end, start }) => {
        setInitialValuesOverride(null);
        setSelectedEvent(null);

        if (actionEnabled) {
            setDefaultDate(start);
            editEventMutation.mutate({
                id: event["@id"],
                values: {
                    endDate: end,
                    startDate: start
                }
            });
        }
    };

    const handleViewChange = (view, date) => {
        setDefaultView(view);
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
                {canView && (
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
                        onView={handleViewChange}
                        defaultView={defaultView}
                        defaultDate={defaultDate}
                    />
                )}
                {crudAllowed && (
                    <React.Fragment>
                        <Fab color="primary" className="mx-auto d-block my-5" onClick={() => handleNewEvent()} disabled={!actionEnabled}>
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

    try {
        if (Boolean(user)) {
            if (isGranted(features.AGENDA_ACCESS, user)) {
                await queryClient.prefetchQuery("events", () => getEventsFromServer(req.headers.cookie));
            }
        }
    } catch (error) {
        // TODO error logging
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    };
}
