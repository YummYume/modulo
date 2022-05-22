import { axiosApiInstance } from "./axios/api";

export const add = async (name, description, active, startDate, endDate, scope) => {
    const response = await axiosApiInstance().post("/events", {
        name,
        description,
        active,
        startDate,
        endDate,
        scope
    });

    return response;
};
