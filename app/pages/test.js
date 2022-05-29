import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useMutation, useQuery, useQueryClient } from "react-query";
import TextField from "@mui/material/TextField";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { axiosApiInstance } from "../api/axios/api";
import HoverButton from "../components/HoverButton";

export default function Test() {
    const queryClient = useQueryClient();
    const structures = useQuery("structures", () => axiosApiInstance().get("/structures"), {
        refetchInterval: false,
        refetchOnWindowFocus: false
    });
    const structureMutation = useMutation((params) =>
        axiosApiInstance().post(`/structures`, {
            name: params.name,
            code: params.code
        })
    );
    const suscribeToHub = async () => {
        const hubUrl = new URL("https://modulo.local:4000/.well-known/mercure", window.origin);
        hubUrl.searchParams.append("topic", "https://api.modulo.local/structures/{id}");

        await fetchEventSource(hubUrl, {
            onmessage(ev) {
                console.log(ev);

                queryClient.setQueryData("structures", (currentStructures) => ({
                    ...currentStructures,
                    data: {
                        ...currentStructures.data,
                        "hydra:member": [...currentStructures.data["hydra:member"], JSON.parse(ev.data)]
                    }
                }));
            }
        });
    };

    useEffect(() => {
        suscribeToHub();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const params = new FormData(e.target);

        structureMutation.mutate({
            name: params.get("name"),
            code: params.get("code")
        });
    };

    return (
        <React.Fragment>
            <Head>
                <title>Test | Modulo</title>
                <meta name="description" content="Page de test." />
            </Head>
            <div className="container-fluid w-100 my-5 mx-lg-5 mx-md-5 mx-sm-3">
                <Typography
                    variant="h2"
                    component="h1"
                    className="text-center mb-5"
                    sx={{
                        color: "primary.main",
                        fontWeight: "400"
                    }}
                >
                    Structures
                </Typography>
                <ul>
                    {structures?.data?.data &&
                        structures.data.data["hydra:member"].map((structure) => (
                            <li key={structure.id}>
                                <Typography variant="body1" component="h2" className="mb-3">
                                    {structure.name} ({structure.code})
                                </Typography>
                            </li>
                        ))}
                </ul>
                <form onSubmit={handleSubmit}>
                    <TextField id="name" name="name" variant="outlined" label="Nom" className="mx-2" />
                    <TextField id="code" name="code" variant="outlined" label="Code" className="mx-2" />
                    <HoverButton buttonProps={{ endIcon: <ArrowForward />, loading: structureMutation.isLoading, loadingPosition: "end" }}>
                        Ajouter
                    </HoverButton>
                </form>
            </div>
        </React.Fragment>
    );
}
