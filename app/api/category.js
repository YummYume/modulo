import { axiosApiInstance } from "./axios/api";

export const getCategories = async () => {
    const response = await axiosApiInstance().get("/categories");

    return response.data;
};
