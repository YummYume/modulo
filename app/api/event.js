import { axiosApiInstance } from "./axios/api";

const add = async (data) => {
    const response = await axiosApiInstance().post("/events", data);

    return response;
}