import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import { dehydrate, QueryClient, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";

import { getCurrentUserFromServer } from "../api/user";
import { useUser } from "../hooks/useUser";
import { useUserLogin } from "../hooks/useUserLogin";

import styles from "../styles/Index.module.scss";

export default function Home() {
    const router = useRouter();
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { data: user } = useUser();
    const onLoginSuccess = ({ data }) => {
        queryClient.setQueryData("user", data);

        router.push("/scope-choice");
    };
    const onLoginError = (error) => {
        let message = "Une erreur est survenue.";

        if (401 === error.response.status) {
            message = "Identifiants invalides.";
        } else if (403 === error.response.status) {
            message = "Votre compte n'est pas configuré pour pouvoir vous connecter. Veuillez contacter le service Modulo.";
        }

        toast.error(message);
    };
    const loginMutation = useUserLogin(onLoginSuccess, onLoginError);
    const initialValues = { uuid: "", password: "" };
    const validationSchema = yup.object({
        uuid: yup.string().required("Veuillez saisir votre numéro d'adhérent."),
        password: yup.string().required("Veuillez saisir votre mot de passe.")
    });
    const handleSubmit = async (values) => loginMutation.mutate(values);

    useEffect(() => {
        if (user) {
            toast.info("Vous êtes déjà connecté.");
        }
    }, []);

    return (
        <React.Fragment>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
                {({ submitCount, isSubmitting, values, errors, handleChange }) => (
                    <Form className={`w-100 ${styles.background}`}>
                        <Box
                            className="h-100 container-fluid d-flex justify-content-center align-items-center"
                            sx={{ backgroundColor: "rgba(4, 38, 62, 0.25)" }}
                        >
                            <Box
                                className="d-flex justify-content-between align-items-center text-center flex-column p-4 shadow-lg"
                                sx={{
                                    width: 550,
                                    height: 350,
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    borderRadius: "0.5rem"
                                }}
                            >
                                <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
                                    Connexion
                                </Typography>
                                <TextField
                                    id="uuid"
                                    name="uuid"
                                    label="N° d'adhérent"
                                    variant="outlined"
                                    fullWidth
                                    value={values.uuid}
                                    onChange={handleChange}
                                    error={submitCount > 0 && !!errors.uuid}
                                    helperText={submitCount > 0 && errors.uuid}
                                />
                                <TextField
                                    id="password"
                                    name="password"
                                    label="Mot de passe"
                                    variant="outlined"
                                    type="password"
                                    fullWidth
                                    value={values.password}
                                    onChange={handleChange}
                                    error={submitCount > 0 && !!errors.password}
                                    helperText={submitCount > 0 && errors.password}
                                />
                                <LoadingButton
                                    loading={isSubmitting || loginMutation.isLoading}
                                    disabled={Boolean(user || !values.uuid || !values.password)}
                                    type="submit"
                                    loadingPosition="end"
                                    variant="contained"
                                    endIcon={<LoginIcon />}
                                >
                                    Connexion
                                </LoadingButton>
                            </Box>
                        </Box>
                    </Form>
                )}
            </Formik>
        </React.Fragment>
    );
}

export async function getServerSideProps({ req }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery("user", () => getCurrentUserFromServer(req.headers.cookie));

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    };
}
