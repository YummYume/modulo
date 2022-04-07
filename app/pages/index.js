import React from 'react';
import { useQuery } from 'react-query';

import { getRoles } from './api/roles';

import styles from '../styles/Home.module.css';

export default function Home() {
    const { isLoading, isError, data, error } = useQuery('roles', getRoles);

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <div className={styles.container}>
            <ul>
                {data.map(role => (
                    <li key={role.id}>{role.name}</li>
                ))}
            </ul>
        </div>
    )
}
