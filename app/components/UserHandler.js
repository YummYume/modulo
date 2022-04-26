import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// import AppAlert from "./AppAlert";
import { useUser } from "../hooks/useUser";
import { useUserLogout } from "../hooks/useUserLogout";

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
        if (router.pathname !== "/" && user.data) {
            setRefetchAttempts(refetchAttempts + 1);
            setDisplayConnectionFailure(true);
        } else {
            setRefetchAttempts(0);
            setDisplayConnectionFailure(false);
        }

        if (refetchAttempts >= 4) {
            logoutMutation.mutate();
        }
    };
    const user = useUser(onQuerySuccess, onQueryFailure);
    const logoutMutation = useUserLogout();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

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
        if (!user.data && user.isError && router.pathname !== "/") {
            router.push("/");
        } else if (user.data && !user.isError && router.pathname === "/") {
            router.push("/roles");
        }
    }, [user, router]);

    return (
        <React.Fragment>
            {/* <AppAlert message="Problème de connexion au serveur, vous risquez d'être déconnecté." severity="error" open={displayConnectionFailure} />
            <AppAlert
                message="Problème de connexion internet. Vos changements ne seront pris en compte qu'après récupération de la connexion."
                severity="warning"
                open={!isOnline}
            /> */}
        </React.Fragment>
    );
}
