import axios from "axios";

export const axiosApiInstance = () => {
    return axios.create({
        baseURL: `https://${process.env.NEXT_PUBLIC_API_HOSTNAME}`,
        withCredentials: true // Allows the browser to send httponly cookies (required for the jwt auth)
    });
};
