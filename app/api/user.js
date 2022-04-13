import { axiosApiInstance } from "./axios/api";

export const getUser = async () => {
    const response = await axiosApiInstance().get("/me");

    return response.data;
};
