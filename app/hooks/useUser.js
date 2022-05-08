import { useQuery } from "react-query";
import { useCookies } from "react-cookie";

import { getCurrentUser } from "../api/user";

export const useUser = (onQuerySuccess, onQueryFailure, onQuerySettled) => {
    const [cookies] = useCookies(["current_scope"]);

    return useQuery("user", getCurrentUser, {
        refetchInterval: 60000,
        retry: 2,
        refetchOnWindowFocus: false,
        select: (data) => {
            if (!data) {
                return data;
            }

            const scopes = data.scopes.filter((scope) => scope.active);
            const cookieScope = parseInt(cookies.current_scope, 10);
            const currentScope = scopes.find((scope) => cookieScope === scope.id) ?? scopes[0];

            return { ...data, scopes, currentScope: currentScope ?? null };
        },
        onSuccess: (data) => {
            onQuerySuccess && onQuerySuccess(data);
        },
        onError: (error) => {
            onQueryFailure && onQueryFailure(error);
        },
        onSettled: (data) => {
            onQuerySettled && onQuerySettled(data);
        }
    });
};
