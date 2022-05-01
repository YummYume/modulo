import { useQuery } from "react-query";

import { getCurrentUser } from "../api/user";

export const useUser = (onQuerySuccess, onQueryFailure, onQuerySettled) => {
    return useQuery("user", getCurrentUser, {
        refetchInterval: 60000,
        retry: 2,
        refetchOnWindowFocus: false,
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
