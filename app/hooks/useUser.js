import { useQuery } from "react-query";

import { refresh } from "../api/user";

export const useUser = (onQuerySuccess, onQueryFailure, onQuerySettled) => {
    return useQuery("user", refresh, {
        refetchInterval: 30000,
        onSuccess: onQuerySuccess,
        onError: onQueryFailure,
        onSettled: onQuerySettled
    });
};
