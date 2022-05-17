import { axiosApiInstance } from "./axios/api";

export const add = async (name, description, active, startDate, endDate) => {
    const response = await axiosApiInstance().post("/events", {
        name,
        description,
        active,
        startDate,
        endDate
    });

    return response;
};
