import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useMutation, useQueryClient } from "react-query";

import { logout } from "../api/user";

export const useUserLogout = (onMutationSuccess, onMutationFailure, onMutationSettled) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [cookies, setCookie] = useCookies(["login_allow_user"]);

    return useMutation(() => logout(), {
        onMutate: async () => {
            await queryClient.cancelQueries("user", { exact: true });
        },
        onSuccess: async (data) => {
            onMutationSuccess && onMutationSuccess(data);

            setCookie("login_allow_user", true, {
                path: "/",
                maxAge: 60,
                sameSite: "strict",
                secure: true
            });

            "/" !== router.pathname && (await router.push("/"));

            queryClient.setQueryData("user", null);
        },
        onError: async (error) => {
            onMutationFailure && onMutationFailure(error);

            if (400 === error.response.status) {
                setCookie("login_allow_user", true, {
                    path: "/",
                    maxAge: 60,
                    sameSite: "strict",
                    secure: true
                });

                "/" !== router.pathname && (await router.push("/"));

                queryClient.setQueryData("user", null);
            }
        },
        onSettled: async (data) => {
            onMutationSettled && onMutationSettled(data);
        }
    });
};
