import { useQuery } from "react-query";

import { getCurrentUser } from "../api/user";

export const useUser = (onQuerySuccess, onQueryFailure, onQuerySettled) => {
    return useQuery("user", getCurrentUser, {
        refetchInterval: 60000 * 3, // 3 minutes
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
