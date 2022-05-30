import { axiosApiInstance } from "./axios/api";

export const login = async (uuid, password) => {
    const response = await axiosApiInstance().post("/auth-token", {
        uuid,
        password
    });

    return response;
};

export const refresh = async () => {
    const response = await axiosApiInstance().get("/refresh-token");

    return response;
};

export const logout = async () => {
    const response = await axiosApiInstance().post("/invalidate-token");

    return response;
};

export const getCurrentUser = async () => {
    const response = await axiosApiInstance().get("/me", {
        headers: {
            Accept: "application/json"
        },
        params: {
            imagineFilter: "avatar"
        }
    });

    return response.data;
};

export const getCurrentUserFromServer = async (cookie = null) => {
    const response = await axiosApiInstance().get("/me", {
        headers: {
            Accept: "application/json",
            Cookie: cookie
        },
        params: {
            imagineFilter: "avatar"
        }
    });

    return response.data;
};

export const getUsers = async () => {
    const response = await axiosApiInstance().get("/users");

    return response.data;
};
