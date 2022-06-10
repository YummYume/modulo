import { useCookies } from "react-cookie";
import { useMutation } from "react-query";

import { login } from "../api/user";

export const useUserLogin = (onMutationSuccess, onMutationFailure, onMutationSettled) => {
    const [cookies, setCookie] = useCookies(["current_scope"]);

    return useMutation((credentials) => login(credentials, cookies.current_scope), {
        onSuccess: (data) => {
            onMutationSuccess && onMutationSuccess(data);
        },
        onError: (error) => {
            onMutationFailure && onMutationFailure(error);
        },
        onSettled: (data) => {
            onMutationSettled && onMutationSettled(data);
        }
    });
};
