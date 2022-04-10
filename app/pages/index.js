import React from 'react';
import Link from 'next/link';
import { useMutation } from 'react-query';

import { login } from './api/login';

import styles from '../styles/Home.module.scss';

export default function Home() {
    const loginMutation = useMutation(credentials => login(credentials.uuid, credentials.password));

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const uuid = formData.get('uuid');
        const password = formData.get('password');

        loginMutation.mutate({ uuid, password });
    }

    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="uuid">UUID : </label>
                    <input type="text" name="uuid" />
                </div>
                <div>
                    <label htmlFor="password">Mot de passe : </label>
                    <input type="password" name="password" />
                </div>
                <button type="submit" disabled={loginMutation.isLoading}>{loginMutation.isLoading ? 'Connexion...' : 'Se connecter' }</button>
            </form>
            {loginMutation.isError && (
                <div>Erreur: {loginMutation.error.response ? loginMutation.error.response.data.message : loginMutation.error.message}</div>
            )}
            {loginMutation.isSuccess && (
                <div>
                    <p>Succès! Vous devriez être connectés. :)</p>
                    <Link href="/roles">
                        <a>Cliquer ici pour voir les roles</a>
                    </Link>
                </div>
            )}
        </div>
    )
}
