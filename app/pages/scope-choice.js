import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QueryClient, dehydrate } from "react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useCookies } from "react-cookie";
import Link from "next/link";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Head from "next/head";

import { useUser } from "../hooks/useUser";
import { getCurrentUserFromServer } from "../api/user";
import HoverButton from "../components/HoverButton";

export default function ScopeChoice() {
    const theme = useTheme();
    const { data: user } = useUser();
    const [cookies, setCookie] = useCookies(["current_scope"]);
    const [selectedScope, setSelectedScope] = useState(null);

    const handleScopeSelection = (scope) => {
        setCookie("current_scope", scope.id, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: "lax",
            secure: true
        });
    };

    useEffect(() => {
        if (user) {
            setSelectedScope(user.currentScope); // this is required to avoid difference between ssr and csr
        } else {
            setSelectedScope(null);
        }
    }, [user]);

    return (
        <React.Fragment>
            <Head>
                <title>{"Modulo | Choix d'une fonction"}</title>
                <meta name="description" content="Choix de votre fonction." />
            </Head>
            <div className="w-100 container-fluid my-2">
                <div className="flex-column row justify-content-around h-100">
                    <Box className="col-12 text-center" color="primary.main">
                        <motion.div initial={{ y: -200 }} animate={{ y: 0 }} transition={{ type: "spring", duration: 2, stiffness: 200 }}>
                            <h1>
                                <Typography variant="h2">Je choisis ma fonction</Typography>
                            </h1>
                        </motion.div>
                    </Box>
                    <div className="col-12">
                        <div className="row justify-content-around">
                            {user.scopes.map((scope) => (
                                <div className="col-xl-2 col-lg-4 col-md-5 col-sm-6 col-12 my-3" key={scope.id}>
                                    <motion.div
                                        className="d-flex flex-column justify-content-around align-items-center text-center h-100"
                                        style={{
                                            padding: "20px 30px",
                                            border: `3px solid ${selectedScope?.id === scope.id ? "blue" : theme.palette.primary.light}`,
                                            borderRadius: "10px",
                                            cursor: "pointer",
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.primary.light,
                                            overflow: "hidden"
                                        }}
                                        whileHover={{ scale: 1.2, borderRadius: "20px" }}
                                        whileTap={{ scale: 1 }}
                                        onClick={() => handleScopeSelection(scope)}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            default: {
                                                type: "spring",
                                                stiffness: 300,
                                                duration: 1
                                            },
                                            opacity: {
                                                type: "tween",
                                                duration: 1
                                            }
                                        }}
                                    >
                                        <Typography variant="subtitle">{scope.role.name}</Typography>
                                        <Typography variant="overline" sx={{ lineHeight: 1.5 }}>
                                            {scope.structure.name}
                                        </Typography>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <Link href="/home">
                            <a>
                                <HoverButton
                                    buttonProps={{
                                        endIcon: <ArrowForward />,
                                        disabled: !user.currentScope
                                    }}
                                >
                                    {"C'est parti !"}
                                </HoverButton>
                            </a>
                        </Link>
                    </div>
                </div>
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
