import { axiosApiInstance } from './axios/api';

export const getRoles = async () => {
    const response = await axiosApiInstance().get('/roles');

    return response.data;
}
