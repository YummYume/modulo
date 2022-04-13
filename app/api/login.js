import { axiosApiInstance } from './axios/api';

export const login = async (uuid, password) => {
    const response = await axiosApiInstance().post('/auth-token', {
        uuid,
        password
    });

    return response;
}
