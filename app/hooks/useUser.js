import { useQuery } from "react-query";

import { getCurrentUser } from "../api/user";

export const useUser = (onQuerySuccess, onQueryFailure, onQuerySettled) => {
    return useQuery("user", getCurrentUser, {
        refetchInterval: 120000,
        retry: 2,
        refetchOnWindowFocus: false,
        select: (data) => {
            if (!data) {
                return data;
            }

            const scopes = data.scopes.filter((scope) => scope.active);

            return { ...data, scopes };
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
