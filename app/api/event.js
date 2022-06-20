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
    const response = await axiosApiInstance().delete(id);

    return response;
};

export const getEvents = async () => {
    const response = await axiosApiInstance().get("/events/allowed");

    return response.data["hydra:member"];
};

export const getEventsFromServer = async (cookie = null) => {
    const response = await axiosApiInstance().get("/events/allowed", {
        headers: {
            Cookie: cookie
        }
    });

    return response.data["hydra:member"];
};
