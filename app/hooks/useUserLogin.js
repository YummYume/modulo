import { useMutation } from "react-query";

import { login } from "../api/user";

export const useUserLogin = (onMutationSuccess, onMutationFailure, onMutationSettled) => {
    return useMutation((credentials) => login(credentials.uuid, credentials.password), {
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
