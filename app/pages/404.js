import React from "react";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import Head from "next/head";

import HoverButton from "../components/HoverButton";

export default function Custom404() {
    return (
        <React.Fragment>
            <Head>
                <title>Modulo | Page introuvable</title>
                <meta name="description" content="Cette page est introuvable." />
            </Head>
            <div className="d-flex flex-column justify-content-center align-items-center w-100">
                <Typography variant="h1" className="text-center mb-5" sx={{ textShadow: "12px 12px 12px rgb(150,150,150)" }}>
                    404 <br />
                    Page Introuvable 😢
                </Typography>
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
