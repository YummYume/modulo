import React from "react";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import { dehydrate, QueryClient, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import Head from "next/head";
import Image from "next/image";
import { useCookies } from "react-cookie";

import { getCurrentUserFromServer } from "../api/user";
import { useUser } from "../hooks/useUser";
import { useUserLogin } from "../hooks/useUserLogin";
import backgroundImage from "../public/images/scout-bg.jpg";
import DarkTextField from "../components/Mui/DarkTextField";

export default function Home({ isPageReady }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [cookies, setCookie] = useCookies(["current_scope"]);
    const { data: user } = useUser();
    const onLoginSuccess = ({ data }) => {
        queryClient.setQueryData("user", data);

        router.push("/scope-choice");
    };
    const onLoginError = (error) => {
        let message = "Une erreur est survenue.";

        if (401 === error?.response?.status) {
            message = "Identifiants invalides.";
        } else if (403 === error.response.status) {
            message = "Votre compte n'est pas configuré pour pouvoir vous connecter. Veuillez contacter le service Modulo.";
        } else if (409 === error.response.status) {
            message = "Une erreur est survenue lors de l'authentification. Veuillez réessayer.";
        }

        toast.error(message);
    };
    const loginMutation = useUserLogin(onLoginSuccess, onLoginError);
    const initialValues = { uuid: "", password: "" };
    const validationSchema = yup.object({
        uuid: yup.string().required("Veuillez saisir votre numéro d'adhérent."),
        password: yup.string().required("Veuillez saisir votre mot de passe.")
    });
    const handleSubmit = async (values) => {
        const scope = cookies.current_scope;

        loginMutation.mutate({ ...values, scope: scope ?? null });
    };

    return (
        <React.Fragment>
            <Head>
                <title>Connexion | Modulo</title>
                <meta
                    name="description"
                    content="Saisissez votre numéro d'adhérent et votre mot de passe pour vous connecter à l'application Modulo."
                />
                <meta name="robots" content="noodp,noydir" />
            </Head>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
                {({ submitCount, isSubmitting, values, errors, handleChange }) => (
                    <Form className="w-100 position-relative">
                        <Image
                            src={backgroundImage}
                            alt="Image de fond contenant des scouts avançant en fille indienne."
                            layout="fill"
                            placeholder="blur"
                            objectFit="cover"
                            priority={true}
                        />
                        <Box
                            className="h-100 container-fluid d-flex justify-content-center align-items-center"
                            position="relative"
                            sx={{
                                backgroundColor: "box.image.filter"
                            }}
                        >
                            <Box
                                className="d-flex justify-content-between align-items-center text-center flex-column p-4 shadow-lg"
                                width="550px"
                                height="350px"
                                borderRadius="0.5rem"
                                color="box.mainBox.color"
                                sx={{
                                    backgroundColor: "box.mainBox.background"
                                }}
                            >
                                <Typography variant="h4" component="h1">
                                    Connexion
                                </Typography>
                                <DarkTextField
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
                                <DarkTextField
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
                                    disabled={Boolean(user || !values.uuid || !values.password || !isPageReady)}
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

export async function getServerSideProps({ req, res }) {
    const queryClient = new QueryClient();
    let allowUser = false;
    let user = null;
    let cookies = req?.headers?.cookie;

    if (Boolean(cookies)) {
        try {
            cookies = cookies.replaceAll(" ", "").split(";");
            allowUser = cookies.includes("login_allow_user=true");

            if (allowUser) {
                res.setHeader("Set-Cookie", [
                    `BEARER=; Path=/; Domain=${process.env.NEXT_PUBLIC_HOST_DOMAIN}; Max-Age=0;`,
                    `refresh_token=; Path=/; Domain=${process.env.NEXT_PUBLIC_HOST_DOMAIN}; Max-Age=0;`
                ]);
            }
        } catch (e) {
            console.error(e);
            allowUser = false;
        }
    }

    try {
        user = await queryClient.fetchQuery("user", () => getCurrentUserFromServer(req.headers.cookie));
    } catch (e) {
        // TODO: log error
    }

    if (Boolean(user) && !allowUser) {
        return {
            redirect: {
                permanent: false,
                destination: "/home"
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
