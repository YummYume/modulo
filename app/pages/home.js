import React, { useState } from "react";
import { dehydrate, QueryClient, useMutation, useQuery } from "react-query";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import * as yup from "yup";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import "moment/locale/fr";

import { getCurrentUserFromServer, getUsers } from "../api/user";
import { addEvent } from "../api/event";
import { getCategories } from "../api/category";
import { useUser } from "../hooks/useUser";
import { isGranted, features } from "../services/user";
import AddEventModal from "../components/AddEventModal";

moment.locale("fr");

export default function Home() {
    const [openModal, setOpenModal] = useState(false);
    const localizer = momentLocalizer(moment);
    const events = [
        {
            id: 0,
            title: "Test",
            allDay: true,
            start: new Date(),
            end: new Date()
        }
    ];
    const addEventMutation = useMutation(
        (values) =>
            addEvent(
                values.name,
                values.description,
                values.active,
                values.startDate,
                values.endDate,
                values.scope,
                values.categories,
                values.participants
            ),
        {
            onSuccess: () => {
                toast.success("Evénement ajouté !");
                setOpenModal(false);
            },

            onError: (error) => {
                if (422 === error?.response?.status) {
                    toast.error("Une erreur est survenue lors de l'ajout.");
                } else {
                    toast.error("Une erreur est survenue.");
                }
            }
        }
    );
    const { data: categories, isFetching: isCategoriesLoading } = useQuery("categories", getCategories, {
        initialData: { "hydra:member": [] }
    });
    const { data: participants, isFetching: isParticipantsLoading } = useQuery("participants", getUsers, {
        initialData: { "hydra:member": [] }
    });
    const initialValues = {
        name: "",
        description: "",
        active: true,
        startDate: null,
        endDate: null,
        categories: [],
        participants: []
    };
    const validationSchema = yup.object({
        name: yup.string().required("Veuillez saisir un nom."),
        description: yup.string().required("Veuillez saisir une description."),
        startDate: yup.date().typeError("Veuillez saisir une date valide."),
        endDate: yup
            .date()
            .typeError("Veuillez saisir une date valide.")
            .min(yup.ref("startDate"), "La date de fin doit être supérieure à la date de début."),
        categories: yup.array(),
        participants: yup.array(),
        active: yup.bool().required("Veuillez saisir un état.")
    });
    const { data: user } = useUser();

    const handleSubmit = async (values) => {
        addEventMutation.mutate({
            ...values,
            scope: `scopes/${user?.currentScope?.id}`,
            categories: values.categories.map((category) => category["@id"]),
            participants: values.participants.map((participant) => participant["@id"])
        });
    };

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
                        <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: 500 }} />
                        <Fab color="primary" className="mx-auto d-block my-5" onClick={() => setOpenModal(true)}>
                            <AddIcon />
                        </Fab>
                    </React.Fragment>
                )}
                <AddEventModal
                    addEventMutation={addEventMutation}
                    categories={categories}
                    handleSubmit={handleSubmit}
                    initialValues={initialValues}
                    isCategoriesLoading={isCategoriesLoading}
                    isParticipantsLoading={isParticipantsLoading}
                    openModal={openModal}
                    participants={participants}
                    setOpenModal={setOpenModal}
                    validationSchema={validationSchema}
                />
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
