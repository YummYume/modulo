import { axiosApiInstance } from "./axios/api";

export const addEvent = async (name, description, active, startDate, endDate, scope, categories, participants) => {
    const response = await axiosApiInstance().post("/events", {
        name,
        description,
        active,
        startDate,
        endDate,
        scope,
        categories,
        participants
    });

    return response;
};
