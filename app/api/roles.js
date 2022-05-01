import { axiosApiInstance } from "./axios/api";

export const getRoles = async () => {
    const response = await axiosApiInstance().get("/roles");

    return response.data;
};

export const getRolesFromServer = async (cookie = null) => {
    const response = await axiosApiInstance().get("/roles", {
        headers: {
            Cookie: cookie
        }
    });

    return response.data;
};
