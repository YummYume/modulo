import { axiosApiInstance } from "./axios/api";

<<<<<<< HEAD
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
=======
const add = async (data) => {
    const response = await axiosApiInstance().post("/events", data);

    return response;
}
>>>>>>> Add event in progress
