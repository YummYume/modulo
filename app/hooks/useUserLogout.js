import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { logout } from "../api/user";

export const useUserLogout = (onMutationSuccess, onMutationFailure, onMutationSettled) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation(() => logout(), {
        onSuccess: (data) => {
            onMutationSuccess && onMutationSuccess(data);

            queryClient.setQueryData("user", null);

            router.push("/");
        },
        onError: (error) => {
            onMutationFailure && onMutationFailure(error);

            if (400 === error.response.status) {
                queryClient.setQueryData("user", null);

                router.push("/");
            }
        },
        onSettled: (data) => {
            onMutationSettled && onMutationSettled(data);
        }
    });
};
