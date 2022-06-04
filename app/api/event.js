import { axiosApiInstance } from "./axios/api";
import { parseFromTimeZone } from "date-fns-timezone";

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

export const getEvents = async () => {
    const response = await axiosApiInstance().get("/events");

    response.data["hydra:member"] = response.data["hydra:member"].map((event) => ({
        ...event,
        startDate: parseFromTimeZone(event.startDate, { timeZone: "Etc/Universal" }),
        endDate: parseFromTimeZone(event.endDate, { timeZone: "Etc/Universal" })
    }));

    return response.data["hydra:member"];
};

export const editEvent = async (id, name, description, active, startDate, endDate, categories, participants) => {
    const response = await axiosApiInstance().patch("/events/" + id, {
        name,
        description,
        active,
        startDate,
        endDate,
        categories,
        participants
    });

    return response;
};
