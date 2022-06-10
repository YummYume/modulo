import { useCookies } from "react-cookie";
import { useMutation, useQueryClient } from "react-query";

import { switchScope } from "../api/user";

export const useUserSwitchScope = (onMutationPreSuccess, onMutationPostSuccess, onMutationFailure, onMutationSettled) => {
    const queryClient = useQueryClient();
    const [cookies, setCookie] = useCookies(["current_scope"]);

    return useMutation((scope) => switchScope(scope), {
        onMutate: async () => {
            await queryClient.cancelQueries("user", { exact: true });
        },
        onSuccess: async (data) => {
            onMutationPreSuccess && onMutationPreSuccess(data);

            const user = data.data;

            queryClient.setQueryData("user", user);

            setCookie("current_scope", user?.currentScope?.id, {
                path: "/",
                maxAge: 60 * 60 * 24 * 365, // 1 year
                sameSite: "lax",
                secure: true
            });

            onMutationPostSuccess && onMutationPostSuccess(data);
        },
        onError: async (error) => {
            onMutationFailure && onMutationFailure(error);
        },
        onSettled: async (data) => {
            onMutationSettled && onMutationSettled(data);
        }
    });
};
