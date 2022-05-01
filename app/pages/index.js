import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import { dehydrate, QueryClient, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

import { getCurrentUserFromServer, login } from "../api/user";
import { useUser } from "../hooks/useUser";
import { toastAlert } from "../mixins/toastAlert";

import styles from "../styles/Index.module.scss";

export default function Home() {
    const router = useRouter();
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { data: user } = useUser();
    const loginMutation = useMutation((credentials) => login(credentials.uuid, credentials.password), {
        onSuccess: ({ data }) => {
            queryClient.setQueryData("user", data);

            router.push("/roles");
        },
        onError: (error) => {
            toastAlert("error", 401 === error.response?.data?.code ? "Identifiants invalides." : "Une erreur est survenue.");
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const uuid = formData.get("uuid");
        const password = formData.get("password");

        loginMutation.mutate({ uuid, password });
    };

    useEffect(() => {
        if (user) {
            toastAlert("info", "Vous êtes déjà connecté.");
        }
    }, []);

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} className={`w-100 ${styles.background}`}>
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
                        <Typography
                            variant="h4"
                            sx={{
                                color: theme.palette.primary.main
                            }}
                        >
                            Connexion
                        </Typography>
                        <TextField id="uuid" name="uuid" label="N° d'adhérent" variant="outlined" fullWidth />
                        <TextField id="password" name="password" label="Mot de passe" variant="outlined" type="password" fullWidth />
                        <LoadingButton
                            loading={loginMutation.isLoading}
                            disabled={Boolean(user)}
                            type="submit"
                            loadingPosition="end"
                            variant="contained"
                            endIcon={<LoginIcon />}
                        >
                            Connexion
                        </LoadingButton>
                    </Box>
                </Box>
            </form>
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
