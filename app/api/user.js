import { axiosApiInstance } from "./axios/api";

export const login = async (credentials, scope) => {
    const response = await axiosApiInstance().post(
        "/auth-token",
        {
            ...credentials
        },
        {
            params: {
                imagineFilter: "avatar",
                scope
            },
            headers: {
                Accept: "application/ld+json"
            }
        }
    );

    return response;
};

export const refresh = async (scope) => {
    const response = await axiosApiInstance().get("/refresh-token", {
        params: {
            imagineFilter: "avatar",
            scope
        },
        headers: {
            Accept: "application/ld+json"
        }
    });

    return response;
};

export const logout = async () => {
    const response = await axiosApiInstance().post("/invalidate-token");

    return response;
};

export const switchScope = async (scope) => {
    const response = await axiosApiInstance().get("/switch-scope", {
        params: {
            imagineFilter: "avatar",
            scope
        },
        headers: {
            Accept: "application/ld+json"
        }
    });

    return response;
};

export const getCurrentUser = async () => {
    const response = await axiosApiInstance().get("/me", {
        headers: {
            Accept: "application/ld+json"
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
            Accept: "application/ld+json",
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
