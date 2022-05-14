import React from "react";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import Head from "next/head";

import HoverButton from "../components/HoverButton";

export default function Custom500() {
    return (
        <React.Fragment>
            <Head>
                <title>Modulo | Erreur serveur</title>
                <meta name="description" content="Une erreur serveur est survenue." />
            </Head>
            <div className="d-flex flex-column justify-content-center align-items-center w-100">
                <h1>
                    <Typography variant="h1" className="text-center mb-5" sx={{ textShadow: "12px 12px 12px rgb(150,150,150)" }}>
                        500 <br />
                        Une erreur est survenue 😢
                    </Typography>
                </h1>
                <Slide direction="up" in={true} timeout={{ enter: 1000 }} mountOnEnter unmountOnExit>
                    <div>
                        <Link href="/home">
                            <a>
                                <HoverButton
                                    buttonProps={{
                                        startIcon: <ArrowBackIcon />
                                    }}
                                >
                                    {"Retour à l'accueil"}
                                </HoverButton>
                            </a>
                        </Link>
                    </div>
                </Slide>
            </div>
        </React.Fragment>
    );
}
