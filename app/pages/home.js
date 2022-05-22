import React, { useState } from "react";
import { dehydrate, QueryClient, useMutation } from "react-query";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Formik, Form } from "formik";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-toastify";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterMoment from "@mui/lab/AdapterMoment";
import "moment/locale/fr";

import { getCurrentUserFromServer } from "../api/user";
import { add } from "../api/event";
import { useUser } from "../hooks/useUser";

moment.locale("fr");

export default function Home() {
    const [openModal, setOpenModal] = useState(false);
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
    const addEventMutation = useMutation(
        (values) => add(values.name, values.description, values.active, values.startDate, values.endDate, values.scope),
        {
            onSuccess: () => {
                toast.success("Evénement ajouté !");
                setOpenModal(false);
            }
        }
    );
    const initialValues = {
        name: "",
        description: "",
        active: true,
        startDate: null,
        endDate: null
    };
    const validationSchema = yup.object({
        name: yup.string().required("Veuillez saisir un nom."),
        description: yup.string().required("Veuillez saisir une description."),
        active: yup.bool().required("Veuillez saisir un état."),
        startDate: yup.date().typeError("Veuillez saisir une date valide."),
        endDate: yup.date().typeError("Veuillez saisir une date valide.")
    });
    const { data: user } = useUser();

    const onSubmit = async (values) => {
        addEventMutation.mutate({ ...values, scope: `scopes/${user?.currentScope?.id}` });
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
                <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: 500 }} />
                <Fab color="primary" className="mx-auto d-block mt-5" onClick={() => setOpenModal(true)}>
                    <AddIcon />
                </Fab>
                <Modal open={openModal} onClose={() => setOpenModal(false)} className="d-flex justify-content-center align-items-center">
                    <Box backgroundColor="box.index.backgroundLogin" maxWidth="90%" width="35rem" className="p-4 rounded">
                        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                            {({ isSubmitting, values, touched, errors, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
                                <Form>
                                    <Typography variant="h4" className="text-center my-4">
                                        Créer un événement
                                    </Typography>
                                    <TextField
                                        id="name"
                                        name="name"
                                        label="Nom"
                                        variant="outlined"
                                        fullWidth
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && !!errors.name}
                                        helperText={touched.name && errors.name}
                                        className="my-2"
                                    />
                                    <TextField
                                        id="description"
                                        name="description"
                                        label="Description"
                                        variant="outlined"
                                        fullWidth
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.description && !!errors.description}
                                        helperText={touched.description && errors.description}
                                        className="my-2"
                                    />
                                    <LocalizationProvider dateAdapter={AdapterMoment} locale={"fr"}>
                                        <DateTimePicker
                                            id="startDate"
                                            name="startDate"
                                            label="Date de début"
                                            value={values.startDate}
                                            onChange={(value) => setFieldValue("startDate", value)}
                                            variant="outlined"
                                            ampm={false}
                                            renderInput={(props) => (
                                                <TextField
                                                    {...props}
                                                    className="my-2"
                                                    fullWidth
                                                    error={touched.startDate && !!errors.startDate}
                                                    onBlur={() => setFieldTouched("startDate", true)}
                                                    helperText={touched.startDate && errors.startDate}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DateTimePicker
                                            id="endDate"
                                            name="endDate"
                                            label="Date de fin"
                                            value={values.endDate}
                                            onChange={(value) => setFieldValue("endDate", value)}
                                            variant="outlined"
                                            ampm={false}
                                            renderInput={(props) => (
                                                <TextField
                                                    {...props}
                                                    className="my-2"
                                                    fullWidth
                                                    error={touched.endDate && !!errors.endDate}
                                                    onBlur={() => setFieldTouched("endDate", true)}
                                                    helperText={touched.endDate && errors.endDate}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    id="active"
                                                    name="active"
                                                    variant="outlined"
                                                    value={values.active}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.active && !!errors.active}
                                                />
                                            }
                                            label="Actif"
                                        />
                                    </FormGroup>
                                    <div className="text-center">
                                        <LoadingButton
                                            loading={isSubmitting || addEventMutation.isLoading}
                                            type="submit"
                                            variant="contained"
                                            loadingPosition="end"
                                            endIcon={<CheckIcon />}
                                        >
                                            Valider
                                        </LoadingButton>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </Modal>
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
