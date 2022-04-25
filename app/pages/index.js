import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { login } from "../api/user";
import AppAlert from "../components/AppAlert";

import styles from "../styles/Index.module.scss";

export default function Home() {
    const theme = useTheme();
    const router = useRouter();
    const queryClient = useQueryClient();
    const loginMutation = useMutation((credentials) => login(credentials.uuid, credentials.password), {
        onSuccess: async () => {
            await queryClient.invalidateQueries("user");

            router.push("/roles");
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

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} className={`w-100 ${styles.background}`}>
                <Box
                    className="h-100 container-fluid d-flex justify-content-center align-items-center"
                    sx={{ backgroundColor: "rgba(4, 38, 62, 0.25)" }}
                >
                    <Box
                        className="d-flex justify-content-between align-items-center text-center flex-column rounded p-4 shadow-lg"
                        sx={{
                            width: 550,
                            height: 350,
                            backgroundColor: "rgba(255, 255, 255, 0.9)"
                        }}
                    >
                        <Typography variant="h4">Connexion</Typography>
                        <TextField id="uuid" name="uuid" label="N° d'adhérent" variant="outlined" fullWidth />
                        <TextField id="password" name="password" label="Mot de passe" variant="outlined" type="password" fullWidth />
                        <LoadingButton
                            loading={loginMutation.isLoading}
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
            <AppAlert
                message={
                    loginMutation.error
                        ? loginMutation.error.response
                            ? loginMutation.error.response.data.message
                            : "Une erreur est survenue."
                        : "Une erreur est survenue."
                }
                severity={"error"}
                open={loginMutation.isError}
            />
        </React.Fragment>
    );
}
