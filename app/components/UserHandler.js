import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { refresh } from "../api/user";
import { useUser } from "../hooks/useUser";
import { useUserLogout } from "../hooks/useUserLogout";
import { toastAlert } from "../mixins/toastAlert";

export default function UserHandler() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(true);
    const [displayConnectionFailure, setDisplayConnectionFailure] = useState(false);
    const [refetchAttempts, setRefetchAttempts] = useState(0);
    const onQuerySuccess = () => {
        setRefetchAttempts(0);
        setDisplayConnectionFailure(false);
    };
    const onQueryFailure = () => {
        if (router.pathname !== "/" && Boolean(user)) {
            setRefetchAttempts(refetchAttempts + 1);
            setDisplayConnectionFailure(true);
        } else {
            setRefetchAttempts(0);
            setDisplayConnectionFailure(false);
        }

        if (refetchAttempts >= 2) {
            logoutMutation.mutate();
        }
    };
    const { data: user } = useUser(onQuerySuccess, onQueryFailure);
    const logoutMutation = useUserLogout();
    const refreshUser = useQuery("refresh", refresh, {
        refetchOnWindowFocus: false,
        refetchInterval: 90000,
        retry: 2,
        refetchIntervalInBackground: true,
        enabled: Boolean(user && isOnline)
    });

    const handleOnline = () => {
        if (!isOnline) {
            toastAlert("success", "De nouveau en ligne.");
            setIsOnline(true);
        }
    };
    const handleOffline = () => {
        if (isOnline) {
            toastAlert(
                "warning",
                "Problème de connexion internet. Vos changements ne seront pris en compte qu'après récupération de la connexion.",
                { autoClose: false }
            );
            setIsOnline(false);
        }
    };

    useEffect(() => {
        if (navigator !== undefined && window !== undefined) {
            navigator.onLine ? handleOnline() : handleOffline();

            window.addEventListener("online", handleOnline);
            window.addEventListener("offline", handleOffline);

            return () => {
                window.removeEventListener("online", handleOnline);
                window.removeEventListener("offline", handleOffline);
            };
        }
    }, []);

    useEffect(() => {
        if (isOnline && displayConnectionFailure) {
            toastAlert("error", "Problème de connexion au serveur, vous risquez d'être déconnecté.", { autoClose: false });
        }
    }, [isOnline, displayConnectionFailure]);

    return <React.Fragment />;
}
