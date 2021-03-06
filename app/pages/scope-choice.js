import React, { useEffect, useState } from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import { QueryClient, dehydrate } from "react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { useUser } from "../hooks/useUser";
import { getCurrentUserFromServer } from "../api/user";
import HoverButton from "../components/HoverButton";
import { useUserSwitchScope } from "../hooks/useUserSwitchScope";

export default function ScopeChoice({ isPageReady }) {
    const theme = useTheme();
    const { data: user } = useUser();
    const [selectedScope, setSelectedScope] = useState(null);
    const [isSelectingScope, setIsSelectingScope] = useState(false);
    const router = useRouter();
    const onMutationPostSuccess = () => {
        router.push("/home");
    };
    const onMutationFailure = () => {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
    };
    const userSwitchScope = useUserSwitchScope(null, onMutationPostSuccess, onMutationFailure);

    const handleScopeSelection = (scope) => {
        if (!userSwitchScope.isLoading && isPageReady) {
            setSelectedScope(scope);
            setIsSelectingScope(true);
        }
    };

    const handleScopeConfirmation = () => {
        if (null !== selectedScope) {
            userSwitchScope.mutate(selectedScope.id);
        }
    };

    useEffect(() => {
        if (Boolean(user) && !isSelectingScope) {
            setSelectedScope(user.currentScope); // this is required to avoid difference between ssr and csr
        } else {
            setSelectedScope(null);
        }
    }, [user]);

    return (
        <React.Fragment>
            <Head>
                <title>{"Choix d'une fonction  | Modulo"}</title>
                <meta name="description" content="Choix de votre fonction." />
            </Head>
            <LazyMotion features={domAnimation} strict>
                <div className="w-100 container-fluid my-2">
                    <div className="flex-column row justify-content-around h-100">
                        <Box className="col-12 text-center">
                            <m.div initial={{ y: -200 }} animate={{ y: 0 }} transition={{ type: "spring", duration: 2, stiffness: 200 }}>
                                <Typography variant="h2" component="h1">
                                    Je choisis ma fonction
                                </Typography>
                            </m.div>
                        </Box>
                        <div className="col-sm-10 col-md-11 mx-auto">
                            <div id="available-scopes" className="row justify-content-around">
                                {user.scopes.map((scope) => (
                                    <div className="col-xl-3 col-lg-4 col-md-5 col-sm-6 my-3" key={scope.id} id={scope.id}>
                                        <m.div
                                            className="d-flex flex-column justify-content-around align-items-center text-center h-100 shadow-lg mx-2"
                                            style={{
                                                padding: "20px 30px",
                                                border: `2px solid ${theme.palette.box.mainBox.color}`,
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                backgroundColor:
                                                    selectedScope?.id === scope.id ? theme.palette.box.mainBox.color : "transparent",
                                                color:
                                                    selectedScope?.id === scope.id
                                                        ? theme.palette.primary.light
                                                        : theme.palette.box.mainBox.color,
                                                overflow: "hidden"
                                            }}
                                            whileHover={{ scale: 1.1, borderRadius: "15px" }}
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
                                        </m.div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 text-center">
                            <HoverButton
                                buttonProps={{
                                    endIcon: <ArrowForward />,
                                    id: "confirm-scope-choice",
                                    loading: userSwitchScope.isLoading,
                                    loadingPosition: "end",
                                    disabled: !isPageReady || null === selectedScope,
                                    onClick: handleScopeConfirmation
                                }}
                            >
                                {"C'est parti !"}
                            </HoverButton>
                        </div>
                    </div>
                </div>
            </LazyMotion>
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
