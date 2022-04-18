import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";

import { login } from "../api/user";
import AppAlert from "../components/AppAlert";

export default function Home() {
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
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        width: 400,
                        height: 300,
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        borderRadius: "4px",
                        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
                        padding: "1rem",
                        justifyContent: "space-between"
                    }}
                >
                    <h1>Connexion</h1>
                    <TextField id="uuid" name="uuid" label="N° d'adhérent" variant="outlined" fullWidth />
                    <TextField id="password" name="password" label="Mot de passe" variant="outlined" type="password" fullWidth />
                    <LoadingButton loading={loginMutation.isLoading} type="submit" loadingPosition="end" variant="contained" endIcon={<LoginIcon />}>
                        Connexion
                    </LoadingButton>
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
