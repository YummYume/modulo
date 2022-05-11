import React from "react";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

export default function Custom500() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center w-100">
            <Typography variant="h1" className="text-center mb-5" sx={{ textShadow: "12px 12px 12px rgb(150,150,150)" }}>
                500 <br />
                Une erreur est survenue 😢
            </Typography>
            <Slide direction="up" in={true} timeout={{ enter: 1000 }} mountOnEnter unmountOnExit>
                <div>
                    <Link href="/home">
                        <a>
                            <Button
                                size="large"
                                sx={{
                                    "&:hover": {
                                        background: "none"
                                    }
                                }}
                                startIcon={<ArrowBackIcon />}
                            >
                                {"Retour à l'accueil"}
                            </Button>
                        </a>
                    </Link>
                </div>
            </Slide>
        </div>
    );
}
