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
