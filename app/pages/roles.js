import React from 'react';
import { useQuery } from 'react-query';

import { getRoles } from './api/roles';

import styles from '../styles/Roles.module.scss';

export default function Roles() {
    const { isLoading, isError, data, error } = useQuery('roles', getRoles, {refetchInterval: 2000});

    return (
        <div className={styles.container}>
            <h1>Roles</h1>
            {isLoading && <p>Chargement...</p>}
            {isError && <p>Erreur: {error.message}</p>}
            {data && <ul>
                {data['hydra:member'].map(role => <li key={role.id}>{role.name}</li>)}
            </ul>}
        </div>
    )
}
