import { parseFromTimeZone } from "date-fns-timezone";

import { axiosApiInstance } from "./axios/api";

export const addEvent = async (event, currentScope) => {
    const response = await axiosApiInstance().post("/events", {
        ...event,
        currentScope
    });

    return response;
};

export const editEvent = async (id, event, currentScope) => {
    const response = await axiosApiInstance().patch(
        id,
        {
            ...event,
            currentScope
        },
        {
            headers: {
                "Content-Type": "application/merge-patch+json"
            }
        }
    );

    return response;
};

export const deleteEvent = async (id, currentScope) => {
    const response = await axiosApiInstance().delete(`/events/${id}`, {
        currentScope
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

export const getEventsFromServer = async (cookie = null) => {
    const response = await axiosApiInstance().get("/events", {
        headers: {
            Cookie: cookie
        }
    });

    response.data["hydra:member"] = response.data["hydra:member"].map((event) => ({
        ...event,
        startDate: parseFromTimeZone(event.startDate, { timeZone: "Etc/Universal" }),
        endDate: parseFromTimeZone(event.endDate, { timeZone: "Etc/Universal" })
    }));

    return response.data["hydra:member"];
};
