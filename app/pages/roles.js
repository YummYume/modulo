import React from "react";
import { useQuery } from "react-query";

import { getRoles } from "../api/roles";
import { useUser } from "../hooks/useUser";

import styles from "../styles/Roles.module.scss";

export default function Roles() {
    const { data: user } = useUser();
    const { isLoading, isError, data, error } = useQuery("roles", getRoles, { refetchInterval: 10000, enabled: (user && user.data) !== false });

    return (
        <div className={styles.container}>
            <h1>Roles</h1>
            {isLoading && <p>Chargement...</p>}
            {isError && <p>Erreur: {error.message}</p>}
            {data && (
                <ul>
                    {data["hydra:member"].map((role) => (
                        <li key={role.id}>{role.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
