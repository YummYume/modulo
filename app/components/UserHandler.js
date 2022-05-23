import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { toast, Flip } from "react-toastify";

import { refresh } from "../api/user";
import { useUser } from "../hooks/useUser";
import { useUserLogout } from "../hooks/useUserLogout";

export default function UserHandler() {
    const internetStatusToast = useRef(null);
    const userStatusToast = useRef(null);
    const [isOnline, setIsOnline] = useState(true);
    const [userFailure, setUserFailure] = useState(false);
    const logoutMutation = useUserLogout();
    const { data: user } = useUser(
        () => setUserFailure(false),
        () => setUserFailure(true)
    );
    const [currentScope, setCurrentScope] = useState(null);
    const router = useRouter();
    const refreshUser = useQuery("refresh", refresh, {
        refetchOnWindowFocus: false,
        refetchInterval: 60000 * 30, // 30 minutes
        retry: 4,
        refetchIntervalInBackground: true,
        enabled: Boolean(user && isOnline),
        onSuccess: () => {
            setUserFailure(false);

            if (userFailure) {
                if (toast.isActive(userStatusToast.current)) {
                    toast.update(userStatusToast.current, {
                        render: "Reconnexion réussie.",
                        type: toast.TYPE.SUCCESS,
                        autoClose: 5000,
                        isLoading: false,
                        closeButton: true,
                        closeOnClick: true,
                        draggable: true,
                        transition: Flip
                    });
                }
            }
        },
        onError: () => {
            if (userFailure) {
                if (toast.isActive(userStatusToast.current)) {
                    toast.update(userStatusToast.current, {
                        render: "La reconnexion a échouée.",
                        type: toast.TYPE.ERROR,
                        autoClose: false,
                        isLoading: false,
                        closeButton: true,
                        closeOnClick: true,
                        draggable: true,
                        transition: Flip
                    });
                }

                logoutMutation.mutate();
            }
        }
    });

    useEffect(() => {
        if (Boolean(user && isOnline && userFailure)) {
            if (!toast.isActive(userStatusToast.current)) {
                userStatusToast.current = toast.loading("Problème de connexion au serveur. Tentative de reconnexion...");
            }

            if (!refreshUser.isFetching) {
                refreshUser.refetch();
            }
        } else if (toast.isActive(userStatusToast.current) && !userFailure) {
            toast.dismiss(userStatusToast.current);
        }
    }, [userFailure, user, isOnline, refreshUser]);

    useEffect(() => {
        if (Boolean(currentScope && user?.currentScope)) {
            if (router.pathname !== "/scope-choice" && user.currentScope.id !== currentScope) {
                router.push("/home");
            }
        }

        setCurrentScope(user?.currentScope?.id);
    }, [user]);

    useEffect(() => {
        if (isOnline) {
            if (toast.isActive(internetStatusToast.current)) {
                toast.update(internetStatusToast.current, {
                    type: toast.TYPE.INFO,
                    render: "De nouveau en ligne.",
                    autoClose: 5000,
                    transition: Flip
                });
            } else if (!!internetStatusToast.current) {
                internetStatusToast.current = toast.info("De nouveau en ligne.", { autoClose: 5000 });
            }
        } else {
            const renderMessage =
                "Problème de connexion internet. Vos changements ne seront pris en compte qu'après récupération de la connexion.";

            if (toast.isActive(internetStatusToast.current)) {
                toast.update(internetStatusToast.current, {
                    type: toast.TYPE.WARNING,
                    render: renderMessage,
                    autoClose: true,
                    transition: Flip
                });
            } else {
                internetStatusToast.current = toast.warning(renderMessage, { autoClose: false });
            }
        }
    }, [isOnline]);

    useEffect(() => {
        if (navigator !== undefined && window !== undefined) {
            window.addEventListener("online", () => setIsOnline(true));
            window.addEventListener("offline", () => setIsOnline(false));

            return () => {
                window.removeEventListener("online", () => setIsOnline(true));
                window.removeEventListener("offline", () => setIsOnline(false));
            };
        }
    }, []);

    return <React.Fragment />;
}
