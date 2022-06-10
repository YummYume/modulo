import { parseFromTimeZone } from "date-fns-timezone";

import { axiosApiInstance } from "./axios/api";

export const addEvent = async (event) => {
    const response = await axiosApiInstance().post("/events", event);

    return response;
};

export const editEvent = async (id, event) => {
    const response = await axiosApiInstance().patch(
        id,
        {
            ...event
        },
        {
            headers: {
                "Content-Type": "application/merge-patch+json"
            }
        }
    );

    return response;
};

export const deleteEvent = async (id) => {
    const response = await axiosApiInstance().delete(`/events/${id}`);

    return response;
};

export const getEvents = async () => {
    const response = await axiosApiInstance().get("/events");

    response.data["hydra:member"] = response.data["hydra:member"].map((event) => ({
        ...event,
        startDate: event.startDate ? parseFromTimeZone(event.startDate, { timeZone: "Etc/Universal" }) : null,
        endDate: event.endDate ? parseFromTimeZone(event.endDate, { timeZone: "Etc/Universal" }) : null
    }));

    return response.data["hydra:member"];
};

export const getEventsFromServer = async (cookie = null) => {
    const response = await axiosApiInstance().get("/events", {
        headers: {
            Cookie: cookie
        }
    });

    response.data["hydra:member"] = response.data["hydra:member"].map((event) => ({
        ...event,
        startDate: event.startDate ? parseFromTimeZone(event.startDate, { timeZone: "Etc/Universal" }) : null,
        endDate: event.endDate ? parseFromTimeZone(event.endDate, { timeZone: "Etc/Universal" }) : null
    }));

    return response.data["hydra:member"];
};
